import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"


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
			block_list: "{}",
			two_factor: "undefined",
			photo: new File([""], "filename")
		},
		urlRoot: "/api/profile/",
		idAttribute: 'user_id',
		initialize: function () {
			this.fetch();
		},
		url: function () {
			return this.urlRoot + encodeURIComponent(this.get('user_id'));
		},
		readAvatar : function (file, callback) {
			var reader = new FileReader(); // File API object for reading a file locally
			reader.onload = (function (theFile, self) {
			  return function (e) {
				console.log(self.toJSON());
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

	const userProfile = new UserProfile();

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

	/* View */
	const ProfileContentView = Backbone.View.extend({
		template: _.template($("script[name='tmpl-content-profile']").html()),
		el: $("#view-content"),
		model: userProfile,
		initialize: function (options) {
			this.listenTo(this.model, "change", this.change);
		},
		render: function () {
			const content = this.template(this.model.toJSON());
			this.$el.html(content);
			return this;
		},
		change: function () {
			if (Navbar.currentRoute.get('route') === "profile") {
				this.render();
			}
		},
		events: {
			// "change .avatar": "upload_image",
			"submit": "onSubmit",
			"click .unblock": "unblock",
		},
		upload_image: function()
		{
			const file = document.getElementById("avatar"); //file
			console.log(file.files[0]);
			var reader = new FileReader();
			(function (self) {
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
			}) (this);	
			reader.readAsDataURL(file.files[0]);
		},
		onSubmit: function(e) {
			e.preventDefault();
			const two_factor = document.getElementById("twofactor").checked ? "on" : "off";
			const file = document.getElementById("avatar"); //file
			if (file.files[0])
				this.upload_image();
			this.model.set({
				nickname: $('.nickname-update').val(),
				name: $('.name-update').val(),
				two_factor: two_factor,
			});			
			console.log(this.model.toJSON());
			const self = this;
			this.model.save({}, {
				success: function() {
					Helper.flash_message("success", "Profile updated successfully!");
				},
				failure: function() {
					Helper.flash_message("danger", "Error while updating profile!");
				}
			});
			this.render();
		},

		unblock: function(e) {
			e.stopImmediatePropagation();
				const block_user = $(e.target).data();
				let res = confirm("Do you want to remove " + block_user.nickname + "(" + block_user.name + ")?");
				if (res === true) {
					var arr = this.model.get("block_list");
					var i
					for (i = 0; i < arr.length; i++)
					{
						if(arr[i].user_id == block_user.user_id)
						{
							arr.splice(i, 1);
							break;
						}
					}
					this.model.set('block_list', arr);
					this.model.save();
					this.render();
				}
		} 
	});

	const SearchedBlockUsersView = Backbone.View.extend({
		el: $("#view-block-searched-users"),
		template: _.template($("script[name='tmpl-block-searched-users-modal']").html()),
		events: {
			"submit": "search_users",
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
			const name = $("#searchBlockUserName").val();
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
		block_user: function (e) {
			const block_user = $(e.target).data();
			const block_list_arr = userProfile.toJSON().block_list;
			var present = false;
			var i = 0;
			for(i = 0; i < block_list_arr.length; i++)
			{
				if(block_list_arr[i].user_id == block_user.userId)
				{
					present = true;
					break;
				}	
			}
			if(present == false)
			{
				const new_user = {};
				new_user.name = block_user.name;
				new_user.nickname = block_user.nickname;
				new_user.user_id = block_user.userId;
				block_list_arr.push(new_user);
				userProfile.set('block_list', block_list_arr);
				userProfile.save();
				searchedBlockUsers.remove(searchedBlockUsers.where({ user_id: block_user.userId })[0]);
				new ProfileContentView().render();
			}
		},
	});

	Profile.content = new ProfileContentView();
	Profile.searchBlockUserModal = new SearchedBlockUsersView();
	Profile.user = user;
})

} // if logged in

export default Profile;


/*


"checked or unchecked"



*/