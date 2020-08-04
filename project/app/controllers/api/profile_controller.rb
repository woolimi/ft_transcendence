class Api::ProfileController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET api/profile/:user_id
	def show
		puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
		if (params[:user_id] == current_user[:id])
			profile = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url])
			friend_id_list = UserProfile.find_by(user_id: current_user[:id])[:friend_list];
			res = []
			friend_id_list.each do |id|
				res.push(UserProfile.find_by(user_id: id).as_json(only: [:nickname]))
			end
			profile[:friend_list] = res
			puts "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
			render json: profile
		else
			render json: {}
		end
	end

	# PATCH / PUT
	def update
		me = UserProfile.find_by(user_id: current_user[:id])
		puts me.as_json()
		if (params[:nickname] <=> me.nickname)
			me.nickname = params[:nickname]
		end
		unless params[:avatar_url].empty?
			Cloudinary::Uploader.upload(me.avatar_url)
			me.avatar_url = params[:avatar_url]
			Helper.flash_message(:success, 'Successfully updated');
		end
		me.save()
	end

end
