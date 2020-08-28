import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const War = {};

$(() => {


    const WarData = Backbone.Model.extend({
        defaults: {
            user_id: $('html').data().userId,
            user_guild_number: "undefined",
            position: "undefined",
            start_date: "undefined",
            end_date: "undefined",
            match_ongoing: "undefined",
            guild_1_score: "undefined",
            guild_2_score: "undefined",
            status: "",
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
                console.log("Model: " + JSON.stringify(this.model));
                this.render();
            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.responseText == "user does not have any guild")
                    Helper.flash_message("danger", "You are not inside any guild!");
                else
                    Helper.flash_message("danger", "Error while loading war!");
            }
        },
        render: function() {
            const content = this.template(this.model.toJSON());
            this.$el.html(content);
            this.renderTimer(this.model.toJSON().end_date);
        },
        renderTimer: function(end_date) {
            this.intervalId = setInterval(function() {
                var dds = new Date(end_date);
                console.log("ed:", end_date);
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
                    document.getElementById("clock").innerHTML = "WAR EXPIRED";
                }
            }, 1000);
        }
    })
})


export default War;