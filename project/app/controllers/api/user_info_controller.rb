class Api::UserInfoController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/user_info/?serarch=:name_or_nickname
	def index
		if params[:search]
			res = UserProfile
				.where.not(user_id: current_user[:id])
				.where("lower(name) LIKE ? OR lower(nickname) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
				.as_json(only: [:user_id, :name, :nickname, :avatar_url])
			render json: res
		end
	end

	# GET /api/user_info/:user_id
	def show
		user_info = UserProfile.find_by(user_id: params[:user_id]).as_json(only: [:user_id, :name, :nickname, :avatar_url])
		render json: user_info
	end
end
