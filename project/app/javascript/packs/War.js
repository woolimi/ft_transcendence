import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Guild from "./Guild.js"
import Router from "./Router.js"
import Helper from "./Helper.js"

const War = {};

if ($('html').data().isLogin) {

$(() => {


    const WarData = Backbone.Model.extend({
        defaults: {
            user_id: $('html').data().userId,
            user_guild_number: "undefined",
            position: "undefined",
            start_date: "undefined",
            end_date: "undefined",
            status: "undefined",
            position: "undefined",
            wins: 0,
            losses: 0,
            unanswered: 0,
            player_guild_anag: "undefined",
            opponent_guild_anag: "undefined",
            match_ongoing: false,
        },
        urlRoot: "/api/war/",
        idAttribute: "user_id",
        url: function() {
            return this.urlRoot + encodeURIComponent(this.get('user_id'));
        },
    });

    War.data = new WarData();

    War.Content = Backbone.View.extend({
        el: $("#view-content"),
        model: War.data,
        template: _.template($("script[name='tmpl-content-war']").html()),
        initialize: async function() {
            try {
                await Helper.fetch(this.model);
                this.render();
            } catch (error) {
                Helper.flash_message("danger", error.responseText);
            }
        },
        render: async function() {
            // await Helper.fetch(this.model);
            const content = this.template(this.model.toJSON());
            await this.$el.html(content);
            if(this.model.toJSON().status == 2)
                this.renderTimer(this.model.toJSON().end_date);
            else
                this.renderTimer(this.model.toJSON().start_date);
        },
        events: {
            "click #attack": "attack",
        },
        send_to_game: function(){
            Router.router.navigate("/game", {trigger: true});
        },
        send_to_history: async function(){
            await Helper.fetch(Guild.allGuilds);
            var guilds = Guild.allGuilds.toJSON();
            var i = 0;
            var gid;
            var gname;
            for (i = 0; i < Object.keys(guilds).length; i++)
            {
                if(guilds[i].anagram == this.model.toJSON().player_guild_anag)
                {
                    gid = guilds[i].id
                    gname = guilds[i].name
                }
            }
            Router.router.navigate("/guild/war_history/" + gname + "/" + gid, {trigger: true});
        },
        renderTimer: function(date) {
            const self = this;
            this.intervalId = setInterval(async function() {
                var dds = new Date(date);
                var countDownDate = dds.getTime();
                var now = Date.now();

                var distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                if (document.getElementById("clock"))
                    document.getElementById("clock").innerHTML = days + "d " + hours + "h " +
                    minutes + "m " + seconds + "s ";

                if (distance < 0) {
                    clearInterval(this.intervalId);
                    if(self.model.toJSON().status == 1)
                        self.send_to_game();
                    else if(self.model.toJSON().status == 2)
                    document.getElementById("clock").innerHTML = "0d 0h 0m 0s <br>Go to guild war history for details"
                }
            }, 1000);
        },
        attack: async function() {
            this.model.set({
                match_ongoing: true
            });
            try {
                await this.model.save();
                Helper.flash_message("War", "success!");
            } catch (error) {
                Helper.flash_message("War", "failure!");
            }
        }
    })
})

}

export default War;