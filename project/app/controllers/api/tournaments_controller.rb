class Api::TournamentsController < ApplicationController
	def index
		@tournaments = Tournament.all
		# render 'index.json.jbuilder'
	end

	def create
		# return head :unauthorized unless current_user.admin?
		@tournament = Tournament.create!(tournament_params)
		render :show
	end

	def show
		@tournament = Tournament.find(params[:id])
		# render 'show.json.jbuilder'
	end

	def join

	end

	def quit

	end
	private

	def tournament_params
		params.permit(
			:name,
			:registration_start,
			:registration_end
		)
	end

end