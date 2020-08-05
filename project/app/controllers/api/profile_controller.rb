require 'json'

class Api::ProfileController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET api/profile/:user_id
	def show
		if (params[:user_id] == current_user[:id])
			profile = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url, :two_factor])
			friend_id_list = UserProfile.find_by(user_id: current_user[:id])[:friend_list];
			res = []
			friend_id_list.each do |id|
				res.push(UserProfile.find_by(user_id: id).as_json(only: [:nickname]))
			end
			profile[:friend_list] = res
			if (profile["two_factor"].eql? "on")
				profile[:two_factor] = "checked"
			end
			if (profile["two_factor"].eql? "off")
				profile[:two_factor] = "unchecked"
			end
			render json: profile
			puts json: profile
		else
			render json: {}
		end
	end

	# PATCH / PUT
	def update
		me = UserProfile.find_by(user_id: current_user[:id])
		puts me.as_json()
		puts params
		if (params[:nickname] <=> me.nickname)
			me.nickname = params[:nickname]
		end
		if (params[:two_factor] <=> me.two_factor)
			me.two_factor = params[:two_factor]
		end
		unless params[:avatar_url].empty?
			Cloudinary::Uploader.upload(me.avatar_url)
			me.avatar_url = params[:avatar_url]
			Helper.flash_message(:success, 'Successfully updated');
		end
		me.save()
	end

end
