import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import moment from 'moment';

const WarHistory = {};

if ($('html').data().isLogin) {

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
                wars[i].end_date = moment(wars[i].end_date).format("YYYY-MM-DD HH:mm:ss")
                wars[i].start_date = moment(wars[i].start_date).format("YYYY-MM-DD HH:mm:ss")
            }
            const content = this.template({
                wars: wars,
                guild_name: guild_name
            });
            this.$el.html(content);
        }
    });
})

}

export default WarHistory;