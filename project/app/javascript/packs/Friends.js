import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Friends = {};

if ($('html').data().isLogin) {
	$(() => {
		/* Models & Collection */
		const Friend = Backbone.Model.extend({
			defaults: {
				user_id: "undefined",
				name: "undefined",
				nickname: "undefined",
				avatar_url: "#",
				status: 0
			},
			urlRoot: "/api/my_friends/",
			idAttribute: 'user_id',
			url: function () {
				return this.urlRoot + encodeURIComponent(this.get('user_id'));
			},
			initialize: function () {},
		})

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
			initialize: function () {
				this.fetch();
			},
		})

		const FriendsList = Backbone.Collection.extend({
			model: Friend,
			url: "/api/my_friends/"
		});
		const SearchedUsers = Backbone.Collection.extend({
			model: User,
			url: "/api/user_info/",
		});

		const friends = new FriendsList();
		const searchedUsers = new SearchedUsers();

		/* View */
		const SerchedUsersView = Backbone.View.extend({
			el: $("#view-searched-users"),
			template: _.template($("script[name='tmpl-searched-users-modal']").html()),
			events: {
				"submit": "search_users",
				"click .addFriendBtn": "add_friend",
			},
			initialize: function() {
				this.listenTo(searchedUsers, "remove", this.render);
			},
			render: function () {
				this.$el.find('#searchedUserList').html(this.template({
					users: searchedUsers.toJSON(),
					friends: friends.toJSON() // to check if user is in friends of not
				}))
			},
			search_users: function (e) {
				e.preventDefault();
				const name = $("#searchUserName").val();
				if (!name)
					return;
				const self = this;
				searchedUsers.fetch({
					data: $.param({ search: name }),
					success: function (collection, response, options) {
						self.render();
					},
				});
			},
			add_friend: function (e) {
				const id = $(e.target).data().userId;
				const new_friend = new Friend({ user_id: id });
				new_friend.fetch({
					success: function() {
						friends.add(new_friend);
						new_friend.save();
						searchedUsers.remove(searchedUsers.where({ user_id: id })[0]);
					}
				});
			},
		});

		const ListView = Backbone.View.extend({
			el: $("#view-friends-list"),
			template: _.template($("script[name='tmpl-friends-list']").html()),
			collection: friends,
			events: {
				"click .removeFriendBtn": "remove_friend"
			},
			initialize: function () {
				this.listenTo(this.collection, "update", this.render);
				this.collection.fetch();
			},
			render: function () {
				this.$el.html(this.template({ friends: this.collection.toJSON() }));
			},
			remove_friend: function (e) {
				e.stopImmediatePropagation();
				const friend = $(e.currentTarget).data();
				let res = confirm("Do you want to remove " + friend.nickname + "(" + friend.name + ") ?");
				if (res === true) {
					const tmp = this.collection.where({ user_id: friend.userId })[0];
					tmp.destroy();
				}
			}
		});

		Friends.list = new ListView();
		Friends.searchUserModal = new SerchedUsersView();
		Friends.friends = friends;
	}) // window.onload

} // if logged in

export default Friends;