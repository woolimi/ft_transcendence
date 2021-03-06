import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"
import Helper from "./Helper.js";
import Router from "./Router"

const Profile = {};

if ($('html').data().isLogin) {
$(() => {

	/* Model */
	const UserProfile = Backbone.Model.extend({
		defaults: {
			user_id: $('html').data().userId,
			name: "undefined",
			nickname: "undefined",
			avatar_url: "#",
			block_list: [],
			two_factor: "undefined",
			photo: new File([""], "filename"),
			guild_id: "",
			is_owner: false,
			is_officer: false
		},
		urlRoot: "/api/profile/",
		idAttribute: 'user_id',
		url: function () {
			return this.urlRoot + encodeURIComponent(this.get('user_id'));
		},
		readAvatar : function (file, callback) {
			var reader = new FileReader(); // File API object for reading a file locally
			reader.onload = (function (theFile, self) {
			  return function (e) {
				self.set({
					photo: file
				});
				self.save
				// Set the file data correctly on the Backbone model
				// self.set({avatar_file_name : "photo", avatar_data : this.file});
				// Handle anything else you want to do after parsing the file and setting up the model.
				callback();
			 };
			})(file, this);
				reader.readAsDataURL(file); // Reads file into memory Base64 encoded
		  }
	})

	const AllUsers = Backbone.Model.extend({
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


	const SearchedBlockUsers = Backbone.Collection.extend({
		model: AllUsers,
		url: "/api/user_info/",
	});

	const searchedBlockUsers = new SearchedBlockUsers();

	const userProfile = new UserProfile();

	const ProfileContentView = Backbone.View.extend({
		template: _.template($("script[name='tmpl-content-profile']").html()),
		twofa_template: _.template($("script[name='tmpl-two-fa']").html()),
		el: $("#view-content"),
		model: userProfile,
		initialize: async function() {
			try {
				this.user_id = $('html').data().userId;
				await Helper.fetch(this.model);
				this.render();
				const data = await Helper.ajax(`/api/two_factors/${this.user_id}`, "", "GET");
				this.render_twofactor(data);
			} catch (error) {
				Helper.flash_message("danger", "Error while loading profile!");
			}
		},
		render_twofactor(data) {
			$("#two_fa").html(this.twofa_template(data));
		},
		render: function () {
			const content = this.template(this.model.toJSON());
			this.$el.html(content);
		},
		events: {
			// "change .avatar": "upload_image",
			"submit #profile-form": "onSubmit",
			"click .unblock": "unblock",
			"click #enableTwoFaBtn": "enable_two_factor",
			"click #disableTwoFaBtn": "disable_two_factor"
		},
		enable_two_factor: async function() {
			await Helper.ajax(`/api/two_factors/${this.user_id}`, "otp_required_for_login=true", "PUT");
			const data = await Helper.ajax(`/api/two_factors/${this.user_id}`, "", "GET");
			this.render_twofactor(data);
		},
		disable_two_factor: async function() {
			await Helper.ajax(`/api/two_factors/${this.user_id}`, "otp_required_for_login=false", "PUT");
			const data = await Helper.ajax(`/api/two_factors/${this.user_id}`, "", "GET");
			this.render_twofactor(data);
		},
		upload_image: function()
		{
			const file = document.getElementById("avatar"); //file
			const reader = new FileReader();
			const self = this;
			reader.addEventListener("load", function () {
				self.model.set({
					photo: this.result
				});
				self.model.save({}, {
					success: function(model) {
						Navbar.userModel.fetch();
					},
				});
			}, false);
			reader.readAsDataURL(file.files[0]);
		},
		onSubmit: async function(e) {
			e.preventDefault();
			const file = document.getElementById("avatar"); //file
			if (file.files[0])
				this.upload_image();
			this.model.set({
				nickname: _.escape($('.nickname-update').val()),
			});
			try {
				await Helper.save(this.model);
				this.render();
				const data = await Helper.ajax(`/api/two_factors/${this.user_id}`, "", "GET");
				this.render_twofactor(data);
				Helper.flash_message("success", "Profile updated successfully!");
			} catch (error) {
				if (error.statusText)
				{
					var res= error.responseText.split("#");
					Helper.flash_message("danger", res[0]);
					$('.nickname-update').val(res[1]);
				}		
			}
		},

		unblock: async function(e) {
			e.stopImmediatePropagation();
			const block_user = $(e.target).data();
			let res = confirm("Do you want to remove " + block_user.nickname + "(" + block_user.name + ")?");
			if (res === true) {
				let arr = this.model.get("block_list");
				arr = _.reject(arr, (user) => user.user_id === block_user.user_id);
				this.model.set('block_list', arr);
				try {
					await Helper.save(this.model);
					this.render();
				} catch (error) {
					Helper.flash_message("danger", "Error while updating block list");
				}
			}
		} 
	});

	
	const SearchedBlockUsersView = Backbone.View.extend({
		el: $("#view-block-searched-users"),
		template: _.template($("script[name='tmpl-block-searched-users-modal']").html()),
		events: {
			"submit #search-block-user": "search_users",
			"click .blockUserBtn": "block_user",
		},
		initialize: function() {
			this.listenTo(searchedBlockUsers, "remove", this.render);
		},
		render: function () {
			this.$el.find('#searchedBlockUserList').html(this.template({
				users: searchedBlockUsers.toJSON(),
				blocked_list: userProfile.toJSON().block_list, // to check if user is in block_list or not
			}))
		},
		search_users: function (e) {
			e.preventDefault();
			const name = _.escape($("#searchBlockUserName").val());
			if (!name)
				return;
			const self = this;
			searchedBlockUsers.fetch({
				data: $.param({ search: name }),
				success: function (collection, response, options) {
					self.render();
				},
			});
		},
		block_user: async function (e) {
			const block_user = $(e.target).data();
			const block_list_arr = userProfile.toJSON().block_list;
			const present = _.find(block_list_arr, (user) => {
				return user.user_id === block_user.userId;
			})
			if(!present)
			{
				const new_user = {};
				new_user.name = block_user.name;
				new_user.nickname = block_user.nickname;
				new_user.user_id = block_user.userId;
				block_list_arr.push(new_user);
				try {
					userProfile.set('block_list', block_list_arr);
					await Helper.save(userProfile);
					searchedBlockUsers.remove(searchedBlockUsers.where({ user_id: block_user.userId })[0]);
					this.render();
					Profile.content.render();
				} catch (error) {
					Helper.flash_message("danger", "Error while updating block list");					
				}
			}
		},
	});

	Profile.Content = ProfileContentView;
	Profile.searchBlockUserModal = new SearchedBlockUsersView();
	Profile.userProfile = userProfile;
})

} // if logged in

export default Profile;

/*

"checked or unchecked"

*/