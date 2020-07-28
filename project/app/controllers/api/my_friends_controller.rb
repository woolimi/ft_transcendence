class Api::MyFriendsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
 	# skip_before_action :verify_authenticity_token

	# GET
	def index
		friend_id_list = UserProfile.where(user_id: current_user[:id]).pluck("friend_list");
		res = []
		friend_id_list.each do |id|
			res.push(UserProfile.where(user_id: id).as_json(only: [:user_id, :name, :nickname, :avatar_url]))
		end
		render json: res[0]
	end

	# GET
	def show
		friend_info = UserProfile.where(user_id: params[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url])
		render json: friend_info
	end

	# PUT | PATCH
	def update
		# validation check
		friend_id_list = UserProfile.where(user_id: current_user[:id]).pluck("friend_list");
		if params[:id] == current_user[:id] || friend_id_list.include?(params[:id])
			return
		end
		if UserProfile.find_by(user_id: params[:id]).blank?
			return
		end
		me = UserProfile.find_by(user_id: current_user[:id])
		me.friend_list.push(params[:id])
		me.save()
	end

	# DELETE
	def destroy
		me = UserProfile.find_by(user_id: current_user[:id])
		me.friend_list.delete(params[:id])
		me.save()
	end
end
