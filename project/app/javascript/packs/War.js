import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const War = {};

$(() => {


    const WarData = Backbone.Model.extend({
        defaults: {
            user_id: $('html').data().userId,
            user_guild_number: "undefined"
        },
        urlRoot: "/api/war/",
        idAttribute: "user_id",
        url: function () {
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
            } catch (error) {user_guild_number
				Helper.flash_message("danger", "Error while loading war!");
			}
        },
        render: function() {
            const content = this.template(this.model.toJSON());
            this.$el.html(content);
        }
    })
    War.content = new WarContent();
})


export default War;