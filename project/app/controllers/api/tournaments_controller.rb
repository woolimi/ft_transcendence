class Api::TournamentsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
	
	# status 0 pending, 1 started, 2 finished
	def index
		return render json: Tournament.where.not(status: 2), status: :ok
	end

	def create
		return render plain: 'Tournament name is too short' if params[:name].length < 4
		return render plain: 'Tournament name is too long' if params[:name].length >= 30
		params[:name] = CGI::escapeHTML(params[:name])
		return render plain: 'This tournament name is already taken', status: :forbidden if Tournament.find_by(name: params[:name])
		return render plain: 'only an admin can create a tournament', status: :forbidden if !current_user.user_profile.admin
		tournament = Tournament.create!(
			name: params[:name],
			status: 0,
			players: [],
			registration_start: DateTime.now,
			registration_end: DateTime.now + 10.minute
		)
		# User.send_to_all('tournament_created', {
		# 	tournament_id: tournament.id,
		# 	tournament_name: tournament.name
		# })
		# TournamentRegistrationLimitJob.set(wait_until: @tournament.registration_end).perform_later(@tournament)
	end

	def show
		return render json: Tournament.find_by(id: params[:id]), status: :ok
	end

	def join
		tournament = Tournament.find_by(params[:id])
		return render plain: 'too many participants', status: :forbidden if (tournament.players.count >= 4)
		begin
			tournament.players << current_user
		rescue => exception
			return render plain: "can't join", status: :forbidden
		end
		if tournament.players.count == 4
			tournament.launch()
		end
	end

	def quit
		tournament = Tournament.find(params[:id])
		return render plain: "user is not a participant, so he can't quit", status: :forbidden if ( ! tournament.players.find(current_user.id) )
		return render plain: "the tournament already started, you cannot quit anymore", status: :forbidden if ( ! tournament.pending! )
		tournament.players.delete(current_user)
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

