class Api::MyFriendsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
 	# skip_before_action :verify_authenticity_token

	# GET
	def index
		friend_id_list = UserProfile.find_by(user_id: current_user[:id])[:friend_list];
		res = []
		friend_id_list.each do |id|
			friend = UserProfile.find_by(user_id: id).as_json(only: [:name, :nickname, :avatar_url])
			status = UserStatus.find_by(user_id: id)
			fin = friend.merge(status.to_json)
			res.push(fin)
		end
		render json: res
	end

	# GET
	def show
		friend = UserProfile.find_by(user_id: params[:user_id]).as_json(only: [:name, :nickname, :avatar_url])
		status = UserStatus.find_by(user_id:  params[:user_id])	
		fin = friend.to_json + status.to_json
		render json: fin
	end

	# PUT | PATCH
	def update
		# validation check
		friend_id_list = UserProfile.find_by(user_id: current_user[:id])[:friend_list];
		if params[:user_id] == current_user[:id] || friend_id_list.include?(params[:user_id])
			return
		end
		if UserProfile.find_by(user_id: params[:user_id]).blank?
			return
		end
		me = UserProfile.find_by(user_id: current_user[:id])
		me.friend_list.push(params[:user_id])
		me.save()
	end

	# DELETE
	def destroy
		me = UserProfile.find_by(user_id: current_user[:id])
		me.friend_list.delete(params[:user_id])
		me.save()
	end

end
