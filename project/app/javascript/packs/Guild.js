import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Profile from "./Profile.js"
import Router from "./Router.js"
import Helper from "./Helper.js"
import GuildChannel from "../channels/guild_channel"
import flatpickr from "flatpickr";
require("flatpickr/dist/flatpickr.css")
// import { French } from "flatpickr/dist/l10n/fr.js"

const Guild = {};

if ($('html').data().isLogin) {

$(() => {

    const AllGuilds = Backbone.Model.extend({
        urlRoot: "/api/guilds/",
        idAttribute: 'user_id',
        url: function() {
            return this.urlRoot + encodeURIComponent(this.get('user_id'));
        },
    });

    Guild.allGuilds = new AllGuilds();

    Guild.Content = Backbone.View.extend({
        el: $("#view-content"),
        template: _.template($("script[name='tmpl-content-guild']").html()),
        war_requests: [],
        model: Guild.allGuilds,
        events: {
            "click .joinGuild": "joinGuild",
            "click .leaveGuild": "leaveGuild",
            "submit #create-guild": "createGuild",
            "click .warHistory": "warHistory",
            "click .toggleOfficer": "toggleOfficer",
            "click .kickMember": "kickMember",
            "click .acceptWar": "acceptWar",
            "click .rejectWar": "rejectWar",
        },
        initialize: async function() {
            try {
                this.user_id = $('html').data().userId;
                if (this.user_id == null)
                    return;
                // await Helper.fetch(this.model);
                // await Helper.fetch(Profile.userProfile);
                GuildChannel.subscribe(this.recv_callback, this);
            } catch (error) {
                Helper.flash_message("danger", "Error while loading guild ranks!");
            }
        },
        recv_callback(data) {
            this.render();
        },
        joinGuild: async function(e) {
            const guild_data = $(e.target).data();
            Profile.userProfile.set('guild_id', guild_data.guild_id);
            await Helper.save(Profile.userProfile);
            // this.render();
            GuildChannel.channel.send({ type: "joinGuild" });

        },
        leaveGuild: async function(e) {
            Profile.userProfile.set('guild_id', null);
            await Helper.save(Profile.userProfile);
            // this.render();
            GuildChannel.channel.send({ type: "leaveGuild" });
        },
        createGuild: async function(e) {
            e.preventDefault();
            const form = $("#create-guild");
            const guildName = $(".newGuildName").val();
            var i = 0
            var new_model = new AllGuilds();
            await Helper.fetch(new_model);
            var guildArr = new_model.toJSON();
            const data = form.serialize();
            for (i = 0; i < Object.keys(guildArr).length; i++) {
                if (guildArr[i].name == guildName)
                    return Helper.flash_message("danger", "Guild already exists");
            }
            await Helper.ajax(`/api/guilds`, "guildName=" + guildName, "POST");
            // this.render();
            GuildChannel.channel.send({ type: "createGuild" });
        },
        warHistory: async function(e) {
            const guild_data = $(e.target).data();
            Router.router.navigate("/guild/war_history/" + guild_data.guild_name + "/" + guild_data.guild_id, { trigger: true });
        },
        toggleOfficer: async function(e) {
            const toggle_data = $(e.target).data();
			await Helper.ajax(`/api/guilds/${this.user_id}`, "toggle_id="+ toggle_data.user_id + "&toggle_guild=" + toggle_data.guild_id, "PUT");
            // this.render();
            GuildChannel.channel.send({ type: "toggleOfficer" });
        },
        kickMember: async function(e) {
            const delete_data = $(e.target).data();
			await Helper.ajax(`/api/guilds/${this.user_id}`, "delete_id="+ delete_data.user_id + "&guild_id=" + delete_data.guild_id, "DELETE");
            // this.render();
            GuildChannel.channel.send({ type: "kickMember" });
        },
        acceptWar: async function(e)
        {
            const accept = $(e.target).data();
            var all_wars;
            var  i = 0;
            try {
                all_wars = await Helper.ajax(`/api/war_request/null`, "", "GET");
                for(i = 0; i < Object.keys(all_wars).length; i++)
                {
                    if(accept.war_id == all_wars[i].id)
                    {
                        if(new Date(all_wars[i].start_date) < Date.now())
                        {
                            Helper.flash_message("danger", "Cannot Accept war after start-time has passed");
                            await Helper.ajax(`/api/war_request/${accept.war_id}`, "", "DELETE");
                            GuildChannel.channel.send({type: "acceptWar"});
                            return;
                        }
                    }
                }
                await Helper.ajax(`/api/war_request/${accept.war_id}`, "", "PUT");
            } catch (error) {
                Helper.flash_message("danger", error.responseText);
            }
            // this.render();
            GuildChannel.channel.send({type: "acceptWar"});
        },
        rejectWar: async function(e)
        {
            const reject = $(e.target).data();
            await Helper.ajax(`/api/war_request/${reject.war_id}`, "", "DELETE");
            // this.render();
            GuildChannel.channel.send({ type: "rejectWar" });
        },
        render: async function() {
            await Helper.fetch(Profile.userProfile);
            var new_model = new AllGuilds();
            await Helper.fetch(new_model);
            var guild_model = new_model.toJSON();
            var guild = []
            var i = 0
            for(i = 0; i < Object.keys(guild_model).length; i++)
            {
                if(_.size(JSON.stringify(guild_model[i].guild_members)) != 4)
                    guild.push(guild_model[i]);
            }
            var mem_list = []
            var current_guild
            for(i = 0; i < Object.keys(guild).length; i++)
            {
                if(guild[i].id == Profile.userProfile.toJSON().guild_id)
                {
                    mem_list = guild[i].guild_members;
                    current_guild = guild[i]
                    break;
                }
            }
            this.war_request = await Helper.ajax(`/api/war_request/null`, "", "GET");
            var j = 0
            console.log(this.war_request)
            for(i = 0; i < Object.keys(this.war_request).length; i++)
            {
                for(j = 0; j < Object.keys(guild).length; j++)
                {
                    if(this.war_request[i].guild_1 == guild[j].id)
                    {
                        this.war_request[i].guild_1 = guild[j].name
                    }   
                    if(this.war_request[i].guild_2 == guild[j].id)
                    {
                        this.war_request[i].guild_2 = guild[j].name
                    }
                }
                this.war_request[i].start_date = (this.war_request[i].start_date.substring(11,16)+ "hrs on " + this.war_request[i].start_date.substring(8,10) + "/" + this.war_request[i].start_date.substring(5,7) + "/" + this.war_request[i].start_date.substring(0,4));

                this.war_request[i].end_date = (this.war_request[i].end_date.substring(11,16)+ "hrs on " + this.war_request[i].end_date.substring(8,10) + "/" + this.war_request[i].end_date.substring(5,7) + "/" + this.war_request[i].end_date.substring(0,4));
            }
            var war_active = 1;
            try{
                await Helper.ajax(`/api/war/${Profile.userProfile.toJSON().user_id}`, "", "GET");

            }catch(error){
                war_active = 0;
            }
            const content = this.template({
                guilds: guild,
                war_active: war_active,
                user: Profile.userProfile.toJSON(),
                guild_members: mem_list,
                current_guild: current_guild,
                war_request: this.war_request,
            });
            this.$el.html(content);
            return this;
        }
    });

    // Guild.content = new GuildContent();
    
    const WarModalView = Backbone.View.extend({
        template: _.template($("script[name='tmpl-declare-war-modal']").html()),
        wardata: [],
        el: $("#app"),
        fp_start: {},
        fp_end: {},
        // model: user,
        events: {
            "click .declareWar": "declareWar",
            "submit #declare-war-form": "onSubmit",
        },
        declareWar: async function(e)
        {
            this.war_data = $(e.target).data();
            this.render();
        },
        onSubmit: async function(e){
            const challenge_data = $(e.target).data();
            const dateTimeStart = this.fp_start.selectedDates[0]
            const dateTimeEnd = this.fp_end.selectedDates[0]
            if((dateTimeStart > dateTimeEnd) || ((Date.now() - dateTimeStart) > 120000))
            {
                Helper.flash_message("danger", "End date should always be greater than Start Date and Start Date cannot be in the Past");
                return;
            }
            await Helper.fetch(Guild.allGuilds);
            var allGuilds = Guild.allGuilds.toJSON();
            var i = 0 
            for(i = 0; i < Object.keys(allGuilds).length; i++)
            {
                if(challenge_data.challenger == allGuilds[i].name &&    allGuilds[i].total_score < parseInt($("#wagerPoints").val()))
                {
                    Helper.flash_message("danger", "Challenger guild does not have enough points for wager");
                    return;
                }
                if(challenge_data.accepter == allGuilds[i].name && allGuilds[i].total_score < parseInt($("#wagerPoints").val()))
                {
                    Helper.flash_message("danger", "Accepter guild does not have enough points for wager");
                    return;
                }
            }
            var data = []
            var war_type = ""
            if($('#include-tournament').is(":checked") == true)
                war_type += "1";
            else
                war_type += "0";
            if($('#include-duel').is(":checked") == true)
                war_type += "1";
            else
                war_type += "0";
                if($('#include-ladder').is(":checked") == true)
                war_type += "1";
            else
                war_type += "0";
            data.push(challenge_data.challenger)
            data.push(challenge_data.accepter)
            data.push($("#wagerPoints").val())
            if($("#maxUnanswered").val())
                data.push($("#maxUnanswered").val())
            else
                data.push(0)
            data.push(dateTimeStart)
            console.log(dateTimeStart)
            console.log(dateTimeStart.getTime())
            data.push(dateTimeEnd)
            data.push(war_type);
            await Helper.ajax(`/api/war_request`, "data=" + data, "POST"); 
            $('#declareWarModal').modal('toggle');
            GuildChannel.channel.send({ type: "rejectWar" });
            // Guild.content.render();
        },
        render: async function(){
            $('#view-declare-war-modal').html(this.template({war_data: this.war_data,}));
            this.fp_start = flatpickr('#war-start-time', {
                enableTime: true, 
                dateFormat: "Y-m-d H:i",
                //locale: "fr"
            });
            this.fp_end = flatpickr('#war-end-time', {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                // locale: "fr"
            });
        },
    });

    WarModalView.content = new WarModalView();
})

}

export default Guild;