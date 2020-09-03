class Api::MatchesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	def index
		return render json: Match.where("started_at IS NOT NULL").where(match_finished: false), status: :ok
	end

	def show 
		m = Match.find_by(id: params[:id])
		return render plain: "forbidden", status: :forbidden if m.blank?
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

		# if (params[:player_1].present? && params[:player_2].present?)
		# 	player_1 = UserProfile.find_by(user_id: params[:player_1])
		# 	player_2 = UserProfile.find_by(user_id: params[:player_2])
		# 	return render plain: "forbidden", status: :forbidden if (player_1.present? && player_1.status != 1)
		# 	return render plain: "forbidden", status: :forbidden if (player_2.present? && player_2.status != 1)
		# 	room = Match.create(
		# 		match_type: params[:match_type],
		# 		player_1: {user_id: player_1.user_id, avatar_url: player_1.avatar_url, nickname: player_1.nickname, ready: false, score: 0, guild_id: player_1.guild_id },
		# 		player_2: {user_id: player_2.user_id, avatar_url: player_2.avatar_url, nickname: player_2.nickname, ready: false, score: 0, guild_id: player_2.guild_id },
		# 		match_finished: false,
		# 		created_at: Time.now())
		# 	return render json: room if (room.present?)
		# end

	end

end
