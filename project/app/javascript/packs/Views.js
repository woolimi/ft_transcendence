import _ from "underscore"
import $ from "jquery"
import Backbone, { View } from "backbone"

const Views = {};

$(() => {

Views.GameContent = Backbone.View.extend({
	el: $("#view-content"),
	template: _.template($("script[name='tmpl-content-game']").html()),
	render: function () {
		console.log("here", this.$el)
		const content = this.template(/* this.model.toJSON() */);
		this.$el.html(content);
		return this;
	}
});

Views.ProfileContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-profile']").html()),
	initialize: function (options) {
		this.route_model = options.route_model;
		this.listenTo(this.model, "change", this.change);
	},
	render: function () {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	},
	change: function () {
		if (this.route_model.toJSON().route === "profile") {
			this.render();
		}
	},
});

Views.GuildContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-guild']").html()),
	render: function () {
		const content = this.template();
		this.$el.html(content);
		return this;
	}
});

Views.NavItem = Backbone.View.extend({
	template: _.template($("script[name='tmpl-nav-item']").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function () {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
});

Views.NavUser = Backbone.View.extend({
	template: _.template($("script[name='tmpl-nav-user']").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function() {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
});

Views.FriendsList = Backbone.View.extend({
	templates: {
			friendsList: _.template($("script[name='tmpl-friends-list']").html()),
			modal: _.template($("script[name='tmpl-friends-list-modal']").html()),
		},
		events: {
			"submit": "searchUsers",
			"click .addFriendBtn": "addFriend",
			"click .removeFriendBtn": "removeFriend"
		},
	initialize: function () {
			this.listenTo(this.collection.friendsList, "update", this.renderFriendsList);
			this.listenTo(this.collection.searchedUsers, "remove", this.renderSearchedUsers);
			const self = this;
			this.collection.friendsList.fetch({
				success: function (collection, response, options) {
					self.renderFriendsList();
				},
			});
			this.renderSearchedUsers();
	},
	renderFriendsList: function() {
		this.$el.find('#myfriends').html(this.templates.friendsList({ friends: this.collection.friendsList.toJSON() }));
	},
	renderSearchedUsers: function() {
		this.$el.find('#searchUsersModal').html(this.templates.modal({ 
			users: this.collection.searchedUsers.toJSON(), 
			friends: this.collection.friendsList.toJSON()
		}))
	},
	searchUsers: function (e) {
		e.preventDefault();
		const name = $("#searchUser").val();
		if (!name)
			return;
		const self = this;
		this.collection.searchedUsers.fetch({
			data: $.param({ search: name }),
			success: function (collection, response, options) {
				self.renderSearchedUsers();
			},
		});
	},
	addFriend: function (e) {
		const friend = $(e.target).data();
		this.collection.friendsList.create({
			id: friend.userId,
			user_id: friend.userId,
			name: friend.name,
			nickname: friend.nickname,
			avatar_url: friend.avatar_url
		});
		const c = this.collection.searchedUsers;
		c.remove(c.where({ user_id: friend.userId})[0]);
	},
	removeFriend: function(e) {
		e.stopImmediatePropagation();
		const friend = $(e.target).data();
		const c = this.collection.friendsList;
		let res = confirm("Do you want to remove " + friend.nickname + "(" + friend.name +") ?");
		if (res === true) {
			const tmp = c.where({ user_id: friend.userId })[0];
			tmp.destroy();
		}
	}
});

// el: $('#app')
Views.UserInfoModal = Backbone.View.extend({
	template: _.template($("script[name='tmpl-user-info-modal']").html()),
	initialize: function() {
		this.listenTo(this.model, "change:user_id", this.fetchAndRender);
	},
	events: {
		"click .userInfoModal": "changeUid"
	},
	render() {
		$('#view-user-info-modal').html(this.template({ user: this.model.toJSON() }));
	},
	changeUid: function(e) {
		const user_id = $(e.currentTarget).data().userId;
		this.model.set({user_id: user_id});
	},
	fetchAndRender: function() {
		const self = this;
		this.model.fetch({
			success: function() {
				self.render();
			}
		});
	},
});

}) // window.onload

export default Views;