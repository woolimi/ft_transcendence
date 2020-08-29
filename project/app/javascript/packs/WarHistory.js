import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
const WarHistory = {};

$(() => {
    const warHistoryModel = Backbone.Model.extend({
        initialize: function(options) {
            this.id_attribute = options.guild_id;
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
            var model = new warHistoryModel({ guild_id: options.guild_id,
            guild_name: options.guild_name });
            await Helper.fetch(model);
            this.render(model);
        },
        render: function(model) {
            var wars = model.toJSON();
            var guild_name = wars.guild_name;
            delete wars.guild_id;
            delete wars.guild_name;
            var i = 0
            for (i = 0; i < Object.keys(wars).length; i++)
            {
                wars[i].end_date = (wars[i].end_date.substring(11,16)+ "hrs on " + wars[i].end_date.substring(8,10) + "/" + wars[i].end_date.substring(5,7) + "/" + wars[i].end_date.substring(0,4));

                wars[i].start_date = (wars[i].start_date.substring(11,16)+ "hrs on " + wars[i].start_date.substring(8,10) + "/" + wars[i].start_date.substring(5,7) + "/" + wars[i].start_date.substring(0,4));
            }
            const content = this.template({
                wars: wars,
                guild_name: guild_name
            });
            this.$el.html(content);
        }
    });
})

export default WarHistory;