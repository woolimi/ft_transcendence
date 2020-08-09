class Api::UserStatusController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/user_status/:user_id
	def show
		user_status = UserProfile.find_by(user_id: params[:user_id])
		render json: user_status
	end

	# PATCH | PUT /api/user_status/:user_id
	def update
		if current_user[:id] == params[:user_id]
			user_status = UserProfile.find_by(user_id: params[:user_id])
			user_status.update(status: params[:status])
			data = {:user_id => params[:user_id], :status => params[:status]}
			ActionCable.server.broadcast "user_status_channel", data
		end
		render json: params[:status]
	end
end
