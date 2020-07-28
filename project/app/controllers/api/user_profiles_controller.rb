# ralis g controller api/user_profiles

class Api::UserProfilesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET
	def index
		if params[:search]
			res = UserProfile
				.where.not(user_id: current_user[:id])
				.where("lower(name) LIKE ? OR lower(nickname) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
				.as_json(only: [:user_id, :name, :nickname, :avatar_url])
			render json: res
		end
	end

	# GET
	def show
		# ex) localhost/api/user_profiles/me
		if params[:id] == "me" 
			my_profile = UserProfile.find_by(user_id: current_user[:id])
			# need to treat if user is not exist
			render json: my_profile
		# ex) localhost/api/user_profiles/mashar
		else
			other_profile = UserProfile.find_by(nickname: params[:id])
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
