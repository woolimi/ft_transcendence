import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"

const UserModal = {};

if ($('html').data().isLogin) {
	$(() => {

		/* Model */
		const User = Backbone.Model.extend({
			defaults: {
				user_id: "undefined",
				name: "undefined",
				nickname: "undefined",
				avatar_url: "#",
			},
			urlRoot: "/api/user_info/",
			idAttribute: 'user_id',
			url: function () {
				return this.urlRoot + encodeURIComponent(this.get('user_id'));
			},
		})

		const user = new User();

		/* View */
		const UserModalView = Backbone.View.extend({
			template: _.template($("script[name='tmpl-user-info-modal']").html()),
			initialize: function () {
				this.listenTo(this.model, "change:user_id", this.fetch_and_render);
			},
			el: $("#app"),
			model: user,
			events: {
				"click .userInfoModal": "change_uid",
				"click #start-chat": "start_chat",
			},
			render() {
				$('#view-user-info-modal').html(this.template({ user: this.model.toJSON() }));
			},
			change_uid: function (e) {
				const user_id = $(e.currentTarget).data().userId;
				this.model.set({ user_id: user_id });
			},
			fetch_and_render: function () {
				const self = this;
				this.model.fetch({
					success: function () {
						self.render();
					}
				});
			},
			start_chat(e) {
				const room = $(e.currentTarget).data().room;
				Router.router.navigate("/chats/" + room, { trigger: true });
				$('#userInfoModal').modal('toggle');
			}
		});

		UserModal.content = new UserModalView();
	})

} // if logged in

export default UserModal;