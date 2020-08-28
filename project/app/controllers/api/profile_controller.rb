require 'json'

class Api::ProfileController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET api/profile/:user_id
	def show
		if (params[:user_id] == current_user[:id])
			profile = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url, :two_factor, :photo, :guild_id])
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
		if ((params[:nickname] <=> me.nickname) != 0)
			user = UserProfile.find_by(:nickname => params[:nickname])
			if (user.present?)
				render plain: "nickname already exists, please use a unique nickname#" + me.nickname, status: :ok
			end
			me.nickname = params[:nickname]
		end
		if (params[:guild_id] != me.guild_id)
			if(params[:guild_id].nil?)
				guild = Guild.find_by(:id => me.guild_id)
				puts ">>>>>>>>>>>>>"
			end
			me.guild_id = params[:guild_id]
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
		# validates = me.save()
		# puts validates
		# if (validates == true)
		# 	puts "true"
		# 	render plain: "", status: :ok
		# else
		# 	render json: nil, status: :internal_server_error
		# end
	end
end
