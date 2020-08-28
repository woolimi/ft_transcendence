class Api::TournamentsController < ApplicationController
	# def test_notification
	# 	other = User.find_by(email: params[:email])
	# 	other.send_notification('coucou', {senderName: current_user.user_profile.name})
	# end

	def index
		@tournaments = Tournament.all
		# render 'index.json.jbuilder'
	end

	def create
		# return render plain: 'forbidden', status: :forbidden if !current_user.user_profile.admin
		@tournament = Tournament.create!(
			name: tournament_params[:name],
			registration_start: DateTime.now,
			registration_end: DateTime.now + 1.hour
		)
		# render :show
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