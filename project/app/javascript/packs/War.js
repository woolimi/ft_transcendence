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
            match_ongoing: "undefined"
        },
        urlRoot: "/api/war/",
        idAttribute: "user_id",
        url: function() {
            return this.urlRoot + encodeURIComponent(this.get('user_id'));
        },
    });

    War.data = new WarData();

    const WarContent = Backbone.View.extend({
        el: $("#view-content"),
        model: War.data,
        template: _.template($("script[name='tmpl-content-war']").html()),
        initialize: async function() {
            try {
                await Helper.fetch(this.model);
                console.log("Model: " + JSON.stringify(this.model));
                this.render();
            } catch (error) {
                Helper.flash_message("danger", "Error while loading war!");
            }
        },
        render: function() {
            this.renderTimer(this.model.toJSON().end_date);
            const content = this.template(this.model.toJSON());
            this.$el.html(content);
        },
        renderTimer: function(end_date) {
            if (!end_date)
                return;
            console.log("end_date: " + end_date);
            var x = setInterval(function() {
                var dds = new Date(end_date.replace(' ', 'T'));
                var countDownDate = new Date(dds).getTime();
                var now = new Date().getTime();

                var distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                if (document.getElementById("clock"))
                    document.getElementById("clock").innerHTML = days + "d " + hours + "h " +
                    minutes + "m " + seconds + "s ";

                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("clock").innerHTML = "WAR EXPIRED";
                }
            }, 1000);
        }
    })
    War.content = new WarContent();
})


export default War;