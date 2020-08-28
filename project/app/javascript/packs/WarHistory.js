import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
const WarHistory = {};

$(() => {
    const warHistoryModel = Backbone.Model.extend({
        initialize: function(options) {
            this.id_attribute = options.guild_id;
            console.log(options.guild_id);
            console.log(options.guild_name);
        },
        urlRoot: "/api/war_history/",
        url: function(options) {
            return this.urlRoot + encodeURIComponent(this.get('guild_id'));
        },
    });

    WarHistory.HistContent = Backbone.View.extend({
        el: $("#view-content"),
        template: _.template($("script[name='tmpl-war-history']").html()),
        initialize: async function(options) {
            console.log(options.guild_name);
            var model = new warHistoryModel({ guild_id: options.guild_id,
            guild_name: options.guild_name });
            await Helper.fetch(model);
            console.log(model.toJSON());
            this.render(model);
        },
        render: function(model) {
            var wars = model.toJSON();
            var guild_name = wars.guild_name;
            delete wars.guild_id;
            delete wars.guild_name;
            const content = this.template({
                wars: wars,
                guild_name: guild_name
            });
            this.$el.html(content);
        }
    });
})

export default WarHistory;