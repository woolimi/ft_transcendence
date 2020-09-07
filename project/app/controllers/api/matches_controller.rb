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
		end
		if (params[:match_type] == "war")
			guild = current_user.user_profile.guild
			return render plain: "forbidden" if guild.blank?
			return render plain: "forbidden" if !guild.in_war?
			war = guild.current_war
			side = -1 if war.guild_1 == guild.id
			side = 1 if war.guild_2 == guild.id
			empty_room = nil
			if side == -1
				empty_room = Match.where(war_id: params[:war_id]).where(match_finished: false).where(player_1: nil)
				return render json: empty_room[0].jbuild() if empty_room.present?
			elsif side == 1
				empty_room = Match.where(war_id: params[:war_id]).where(match_finished: false).where(player_2: nil)
				return render json: empty_room[0].jbuild() if empty_room.present?
			end
			room = Match.create!(
				match_type: params[:match_type],
				match_finished: false,
				war_id: params[:war_id],
				created_at: Time.now())
			return render json: room.jbuild() if room.present?
		end
		return render plain: "forbidden", status: :forbidden
	end

end
