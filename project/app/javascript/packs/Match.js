import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
// import ChatChannel from "../channels/chat_channel"
// import Helper from "./Helper"
// import Profile from "./Profile"
// import Channel from "./Channel"

const Match = {};
if ($('html').data().isLogin) {
    $(() => {
        Match.Content = Backbone.View.extend({
        el: $("#view-content"),
        events: {
            "click .startMatch": "start_match",
            "keydown": "keyaction",
        },
        initialize: function() {
            this.template = _.template($("script[name='tmpl-content-match']").html()),
            this.render();
        },
        render: function(){
			const content = this.template();
			this.$el.html(content);
        },
        start_match: function(){
            console.log("Ting ting");
        },
        keyaction: function(e){
            if(e.keyCode == 40)
                console.log("Down");
            else if(e.keyCode == 38)
                console.log("Up");
        }
        });
    });
}

export default Match;