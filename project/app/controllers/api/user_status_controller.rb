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

      # check = User.where({ ft_id: env['warden'].user[:uid] })
      #   .select("users.id, user_profiles.status")
      #   .joins("INNER JOIN user_profiles ON users.id = user_profiles.user_id")[0]
      # if (check[:status] > 0)
      #   flash[:alert] = "Please close other session first"
      #   redirect_to root_path
      # if check[:status] == 1
      #   redirect_to destroy_user_session_path
      # sign_out_and_redirect(resource_or_scope)
