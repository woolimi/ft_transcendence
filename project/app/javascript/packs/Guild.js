import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Profile from "./Profile.js"
import Router from "./Router.js"
import Helper from "./Helper.js"

const Guild = {};

$(() => {

    const AllGuilds = Backbone.Model.extend({
        urlRoot: "/api/guilds/",
        idAttribute: 'user_id',
        url: function() {
            return this.urlRoot + encodeURIComponent(this.get('user_id'));
        },
    });

    Guild.allGuilds = new AllGuilds();

    const GuildContent = Backbone.View.extend({
        el: $("#view-content"),
        template: _.template($("script[name='tmpl-content-guild']").html()),
        model: Guild.allGuilds,
        events: {
            "click .joinGuild": "joinGuild",
            "click .leaveGuild": "leaveGuild",
            "submit #create-guild": "createGuild",
            "click .warHistory": "warHistory",
            "click .toggleOfficer": "toggleOfficer",
            "click .kickMember": "kickMember",
        },
        initialize: async function() {
            try {
                this.user_id = $('html').data().userId;
                if (this.user_id == null)
                    return;
                await Helper.fetch(this.model);
                await Helper.fetch(Profile.userProfile);
            } catch (error) {
                Helper.flash_message("danger", "Error while loading guild ranks!");
            }
        },
        joinGuild: async function(e) {
            const guild_data = $(e.target).data();
            Profile.userProfile.set('guild_id', guild_data.guild_id);
            await Helper.save(Profile.userProfile);
            this.render();
        },
        leaveGuild: async function(e) {
            Profile.userProfile.set('guild_id', null);
            await Helper.save(Profile.userProfile);
            await Helper.fetch(this.model);
            this.render();
        },
        createGuild: async function(e) {
            e.preventDefault();
            const form = $("#create-guild");
            const guildName = $(".newGuildName").val();
            var i = 0
            var guildArr = this.model.toJSON();
            const data = form.serialize();
            for (i = 0; i < Object.keys(guildArr).length; i++) {
                if (guildArr[i].name == guildName)
                    return Helper.flash_message("danger", "Guild already exists");
            }
            await Helper.ajax(`/api/guilds`, "guildName=" + guildName, "POST");
            await Helper.fetch(this.model);
            this.render();
            console.log($(".newGuildName").val());
        },
        warHistory: async function(e) {
            const guild_data = $(e.target).data();
            Router.router.navigate("/guild/war_history/" + guild_data.guild_name + "/" + guild_data.guild_id, { trigger: true });
        },
        toggleOfficer: async function(e) {
            const toggle_data = $(e.target).data();
			await Helper.ajax(`/api/guilds/${this.user_id}`, "toggle_id="+ toggle_data.user_id + "&toggle_guild=" + toggle_data.guild_id, "PUT");
            this.render();
        },
        kickMember: async function(e) {
            const delete_data = $(e.target).data();
			await Helper.ajax(`/api/guilds/${this.user_id}`, "delete_id="+ delete_data.user_id + "&guild_id=" + delete_data.guild_id, "DELETE");
            this.render();
        },
        render: async function() {
            await Helper.fetch(Profile.userProfile);
            var new_model = new AllGuilds();
            await Helper.fetch(new_model);
            var guild = new_model.toJSON();
            var mem_list = []
            var current_guild
            var i = 0
            for(i = 0; i < Object.keys(guild).length; i++)
            {
                if(guild[i].id == Profile.userProfile.toJSON().guild_id)
                {
                    mem_list = guild[i].guild_members;
                    current_guild = guild[i]
                }
            }
            const content = this.template({
                guilds: guild,
                user: Profile.userProfile.toJSON(),
                guild_members: mem_list,
                current_guild: current_guild,
            });
            this.$el.html(content);
            return this;
        }
    });

    Guild.content = new GuildContent();
})

export default Guild;