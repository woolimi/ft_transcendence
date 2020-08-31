class Api::TournamentsController < ApplicationController
	def index
		@tournaments = Tournament.all
		# render 'index.json.jbuilder'
	end

	def test_reset # for test purposes
		tournament = Tournament.find(params[:id])
		tournament.status = :pending
		user1=User.find_by({ email: "john@asdf.com"})
		user2=User.find_by({ email: "jai@asdf.com"})
		user3= User.find_by({ email: "doby@asdf.com" })
		users=[user1,user2,user3]
		tournament.players.clear
		tournament.players.push users
		tournament.matches.clear()
		@tournament = tournament
		render 'show.json.jbuilder'
	end

	def create
		return render plain: 'This tournament name is already taken', status: :forbidden if Tournament.find_by(name:tournament_params[:name])
		return render plain: 'only an admin can create a tournament', status: :forbidden if !current_user.user_profile.admin
		@tournament = Tournament.create!(
			name: tournament_params[:name],
			registration_start: DateTime.now,
			registration_end: DateTime.now + 10.minute
		)
		User.send_to_all('tournament_created', {
			tournament_id: @tournament.id,
			tournament_name: @tournament.name
		})
		TournamentRegistrationLimitJob.set(wait_until: @tournament.registration_end).perform_later(@tournament)
	end

	def show
		@tournament = Tournament.find(params[:id])
		# render 'show.json.jbuilder'
	end

	def join
		tournament = Tournament.find(params[:id])
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

