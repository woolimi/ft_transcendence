import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const War = {};

$(() => {
    const WarContent = Backbone.View.extend({
        el: $("#view-content"),
        template: _.template($("script[name='tmpl-content-war']").html()),
        render: function() {
            console.log("Rendering war temp")
            const content = this.template();
            this.$el.html(content);
        }
    })
    War.content = new WarContent();
})


export default War;