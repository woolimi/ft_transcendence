class Api::TournamentsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
	
	# status 0 pending, 1 semi 2 final 3 finished
	def index
		res = []
		res += Tournament.where(status: 3).order("registration_start DESC").limit(1).as_json
		res += Tournament.where.not(status: 3).as_json
		return render json: res, status: :ok
	end

	def create
		return render plain: 'Tournament name is too short' if params[:name].length < 3
		return render plain: 'Tournament name is too long' if params[:name].length >= 30
		params[:name] = CGI::escapeHTML(params[:name])
		return render plain: 'This tournament name is already taken', status: :forbidden if Tournament.find_by(name: params[:name])
		return render plain: 'only an admin can create a tournament', status: :forbidden if !current_user.user_profile.admin
		tournament = Tournament.create!(
			name: params[:name],
			status: 0,
			players: [],
			registration_start: DateTime.now,
			registration_end: DateTime.now + 1.minute
		)
		User.send_to_all('tournament_created', {
			tournament_id: tournament.id,
			tournament_name: tournament.name
		})
		TournamentRegistrationLimitJob.set(wait_until: tournament.registration_end).perform_later(tournament)
	end

	def show
		tournament = Tournament.find_by(id: params[:id])
		return render plain: 'forbidden', status: :forbidden if tournament.nil?
		return render json: tournament.jbuild(), status: :ok
	end

	# PUT /api/tournaments/:tournament_id/players
	def join
		tournament = Tournament.find_by(id: params[:tournament_id])
		return render plain: 'This tournament does not exist', status: :forbidden if tournament.blank?
		return render plain: 'Registration is already finished', status: :forbidden if tournament.registration_end < Time.now()
		return render plain: 'too many participants', status: :forbidden if tournament.players.length >= 4
		return render plain: 'You are already in list', status: :forbidden if !tournament.players.find_index(current_user[:id]).nil?
		tournament.players.push(current_user[:id])
		if tournament.save()
			ActionCable.server.broadcast "tournament_#{tournament.id}_channel", {type: "participant", data: tournament.jbuild()}
			return render plain: "ok", status: :ok
		end
	end

	# DELETE /api/tournaments/:tournament_id/players
	def quit
		tournament = Tournament.find(params[:tournament_id])
		return render plain: 'This tournament does not exist', status: :forbidden if tournament.blank?
		return render plain: 'registration time is ended', status: :forbidden if tournament.registration_end < Time.now()
		return render plain: "You aren't in list", status: :forbidden if tournament.players.find_index(current_user[:id]).nil?
		# return render plain: "the tournament already started, you cannot quit anymore", status: :forbidden if ( ! tournament.pending! )
		tournament.players.delete(current_user[:id])
		if tournament.save()
			ActionCable.server.broadcast "tournament_#{tournament.id}_channel", {type: "participant", data: tournament.jbuild()}
			return render plain: "ok", status: :ok
		end
	end

	# PUT /api/tournaments/:tournament_id/dummy
	def dummy
		tournament = Tournament.find_by(id: params[:tournament_id])
		return render plain: "fail to create dummy", status: :forbidden if tournament.blank?
		tournament.players = []
		for i in 1..3 do
			tournament.players.push(User.find_by(ft_id: i).id)
		end
		tournament.save!()
		ActionCable.server.broadcast "tournament_#{tournament.id}_channel", {type: "participant", data: tournament.jbuild()}
		return render plain: "dummy created", status: :ok
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

