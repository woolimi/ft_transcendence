class Api::MatchesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	def index
		matches = Match.where("started_at IS NOT NULL").where(match_finished: false)
		res = []
		matches.each{ |m| 
			res.push(m.jbuild())
		}
		return render json: res, status: :ok
	end

	def show 
		m = Match.find_by(id: params[:id])
		return render plain: "Invalid match", status: :forbidden if m.blank?
		return render json: m.jbuild(), status: :ok
	end

	# /api/matches/ POST
	# match_type : duel, duel_friend, ladder, tournament_semi, tournament, war
	def create
		if (params[:match_type] == "duel_friend")
			return render plain: "forbidden", status: :forbidden if (params[:player_1].blank? && params[:player_2].blank?)
			m = Match.create!(match_type: params[:match_type],
				player_left_id: params[:player_1],
				player_right_id: params[:player_2],
				match_finished: false,
				created_at: Time.now())
			return render json: m.jbuild(), status: :ok if m.present?
		end
		if (params[:match_type] == "duel" || params[:match_type] == "ladder")
			# find single or empty room
			single_rooms = Match.where(match_type: params[:match_type]).where(started_at: nil)
				.where("player_1 IS NULL OR player_2 IS NULL").order("created_at ASC");
			me = UserProfile.find_by(user_id: current_user[:id]);
			if single_rooms.empty? # if single_room is empty, create new room
				room = Match.create(
					match_type: params[:match_type],
					match_finished: false,
					created_at: Time.now())
				return render json: room.jbuild() if (single_rooms.present? && me.present?)
			else # if single_room is exist, enter into it
				return render json: single_rooms[0].jbuild() if single_rooms[0].save()
			end
			return render plain: "internal server error", status: :internal_server_error
		end
	end

end
