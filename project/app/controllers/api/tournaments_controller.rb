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
		return render json: jbuild(Tournament.find_by(id: params[:id])), status: :ok
	end

	# PUT /api/tournaments/:tournament_id/players
	def join
		tournament = Tournament.find_by(id: params[:tournament_id])
		return render plain: 'forbidden', status: :forbidden if tournament.blank?
		return render plain: 'too many participants', status: :forbidden if tournament.players.length >= 4
		return render plain: 'You are already in list', status: :forbidden if !tournament.players.find_index(current_user[:id]).nil?
		tournament.players.push(current_user[:id])
		return render json: jbuild(tournament) if tournament.save()
	end

	# DELETE /api/tournaments/:tournament_id/players
	def quit
		tournament = Tournament.find(params[:tournament_id])
		return render plain: 'forbidden', status: :forbidden if tournament.blank?
		return render plain: "You aren't in list", status: :forbidden if tournament.players.find_index(current_user[:id]).nil?
		# return render plain: "the tournament already started, you cannot quit anymore", status: :forbidden if ( ! tournament.pending! )
		tournament.players.delete(current_user[:id])
		return render json: jbuild(tournament) if tournament.save()
	end

	private

	def tournament_params
		params.permit(
			:name,
			:registration_start,
			:registration_end
		)
	end

	def jbuild(tournament)
		tournament.players.each{ |p|
			u = UserProfile.find_by(user_id: p).as_json(only: [:user_id, :avatar_url, :nickname]);
			tournament.players.delete(p)
			tournament.players.push(u)
		}
		return tournament
	end

end

