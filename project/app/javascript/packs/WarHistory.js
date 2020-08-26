import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
const WarHistory = {};

$(() => {
    const warHistoryModel = Backbone.Model.extend({
        initialize: function(options){
            this.id_attribute = options.guild_id;
            console.log(options.guild_id);
        },
        urlRoot: "/api/war_history/",
		url: function (options) {
			return this.urlRoot + encodeURIComponent(this.get('guild_id'));
		},
    });

	WarHistory.HistContent = Backbone.View.extend({
        el: $("#view-content"),
        template: _.template($("script[name='tmpl-war-history']").html()),
        initialize: async function(options)
        {
            var model =  new warHistoryModel({guild_id: options.guild_id});
            await Helper.fetch(model);
            console.log(model.toJSON());
            this.render();
        },
        render: function()
        {
            const content = this.template();
			this.$el.html(content);
        }
    });
})

export default WarHistory;