# ralis g controller api/user_profiles

class Api::UserProfilesController < ApplicationController
	# protect_from_forgery
	# before_action :authenticate_user!

	# GET
	def show
		# ex) localhost/api/user_profiles/me
		if params[:id] == "me" 
			my_profile = UserProfile.find_by(user_id: current_user[:id])
			# need to treat if user is not exist
			render json: my_profile
		# ex) localhost/api/user_profiles/mashar
		else
			other_profile = UserProfile.find_by(nickname: parmas[:id])
			# need to show less data here...
			render json: other_profile
		end
	end

	# POST
	def create
	end

	# PATCH / PUT
	def update
	end

	# DELETE
	def destroy
	end
end
