class Api::MatchesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
	def show 
		room = Match.find_by(id: params[:id])
		return render plain: "forbidden", status: :forbidden if room.blank?
		return render json: room, status: :ok
	end

	def create
		# reject if user have another game session
		#  code...

		# find empty or single person room
		single_rooms = Match
			.where("match_type = '#{params[:match_type]}' AND started_at IS NULL AND (player_1 IS NULL OR player_2 IS NULL)")
			.order("created_at ASC");
		me = UserProfile.find_by(user_id: current_user[:id]);
		if single_rooms.empty? # if single_room is empty, create new room
			single_room = Match.create(
				match_type: params[:match_type],
				player_1: {user_id: me.user_id, avatar_url: me.avatar_url, nickname: me.nickname, ready: false, score: 0},
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
