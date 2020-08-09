require 'json'

class Api::ProfileController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET api/profile/:user_id
	def show
		if (params[:user_id] == current_user[:id])
			profile = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url, :two_factor, :photo])
			block_id_list = UserProfile.find_by(user_id: current_user[:id])[:block_list];
			res = []
			block_id_list.each do |id|
				res.push(UserProfile.find_by(user_id: id).as_json(only: [:user_id, :nickname, :name]))
			end
			profile[:block_list] = res
			render json: profile			
		else
			render json: {}
		end
	end

	# PATCH / PUT
	def update
		me = UserProfile.find_by(user_id: current_user[:id])
		# puts me.photo.as_json()
		if (params[:nickname] <=> me.nickname)
			me.nickname = params[:nickname]
		end
		arr =  params[:block_list].as_json();
		res = []
		arr.each do |blocked_users|
			res.push(blocked_users["user_id"])
		end
		if (res <=> me.block_list)
			me.block_list = res
		end
		if (params[:two_factor] <=> me.two_factor)
			me.two_factor = params[:two_factor]
		end
		if (params[:photo] <=> "")
			result = Cloudinary::Uploader.upload(params[:photo])
			me.avatar_url = result["url"]
		end
		me.save()
	end

end
