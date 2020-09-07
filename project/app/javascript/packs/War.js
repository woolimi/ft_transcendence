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
            const content = this.template(this.model.toJSON());
            this.$el.html(content);
            if(this.model.toJSON().status == 2)
                this.renderTimer(this.model.toJSON().end_date);
            else
            {
                document.getElementById("attack").disabled = true;
                this.renderTimer(this.model.toJSON().start_date);
            }
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
                    {
                        document.getElementById("clock").innerHTML = "0d 0h 0m 0s <br>Go to guild war history for details"
                        document.getElementById("attack").disabled = true;
                    }
                }
            }, 1000);
        },
        attack: async function(e) {
            e.stopImmediatePropagation();
            const data = War.data.toJSON();
            try {
                const ongoing = await Helper.ajax(`/api/war_ongoing/${data.id}`);
                if (ongoing === "true")
                    throw "There can be ONLY one match in war time";
                const new_match = await Helper.ajax('/api/matches/',
                    `match_type=war&war_id=${data.id}`, 'POST');
                await Helper.ajax('/api/war/notify_enemy_guild_of_attack',{
                    war_id: data.id,
                    match_id: new_match.id
                }, 'POST')
                return Router.router.navigate(`/game/war/${new_match.id}`, { trigger: true });
            } catch (error) {
                if (error.responseText)
                    Helper.flash_message("danger", "War ended");
                else
                    Helper.flash_message("danger", error);
            }
        }
    })
})

}

export default War;