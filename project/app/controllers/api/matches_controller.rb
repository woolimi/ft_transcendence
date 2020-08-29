class Api::MatchesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	def index
		return render json: Match.where("started_at IS NOT NULL").where(match_finished: false), status: :ok
	end

	def show 
		room = Match.find_by(id: params[:id])
		return render plain: "forbidden", status: :forbidden if room.blank?
		return render json: room, status: :ok
	end

	# /api/matches/ POST
	def create
		# reject if user have another game session
		if (params[:player_1].present? && params[:player_2].present?)
			player_1 = UserProfile.find_by(user_id: params[:player_1])
			player_2 = UserProfile.find_by(user_id: params[:player_2])
			return render plain: "forbidden", status: :forbidden if (player_1.present? && player_1.status != 1)
			return render plain: "forbidden", status: :forbidden if (player_2.present? && player_2.status != 1)
			room = Match.create(
				match_type: params[:match_type],
				player_1: {user_id: player_1.user_id, avatar_url: player_1.avatar_url, nickname: player_1.nickname, ready: false, score: 0},
				player_2: {user_id: player_2.user_id, avatar_url: player_2.avatar_url, nickname: player_2.nickname, ready: false, score: 0},
				match_finished: false,
				created_at: Time.now())
			return render json: room if (room.present?)
		end
		# find empty or single person room
		single_rooms = Match
			.where("match_type = '#{params[:match_type]}' AND started_at IS NULL AND (player_1 IS NULL OR player_2 IS NULL)")
			.order("created_at ASC");
		me = UserProfile.find_by(user_id: current_user[:id]);
		if single_rooms.empty? # if single_room is empty, create new room
			single_room = Match.create(
				match_type: params[:match_type],
				player_1: {user_id: me.user_id, avatar_url: me.avatar_url, nickname: me.nickname, ready: false, score: 0},
				match_finished: false,
				created_at: Time.now())
			return render json: single_room if (single_room.present? && me.present?)
		else # if single_room is exist, enter into it
			if (single_rooms[0].player_1.blank?)
				single_rooms[0].player_1 = {user_id: me.user_id, avatar_url: me.avatar_url, nickname: me.nickname, ready: false, score: 0}
			elsif (single_rooms[0].player_2.blank?)
				single_rooms[0].player_2 = {user_id: me.user_id, avatar_url: me.avatar_url, nickname: me.nickname, ready: false, score: 0}
			end
			return render json: single_rooms[0] if single_rooms[0].save()
		end
		return render plain: "internal server error", status: :internal_server_error
	end

end
