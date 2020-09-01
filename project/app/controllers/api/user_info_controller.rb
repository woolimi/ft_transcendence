class Api::UserInfoController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/user_info/?search=:name_or_nickname
	def index
		if params[:search]
			res = UserProfile
				.where.not(user_id: current_user[:id])
				.where("lower(name) LIKE ? OR lower(nickname) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
				.as_json(only: [:user_id, :name, :nickname, :avatar_url])
			render json: res
		end
	end

	# GET /api/user_info/:user_id
	def show
		info = UserProfile.find_by(user_id: params[:user_id])
		win = Match.where(winner: params[:user_id]).count
		loss = Match.where(loser: params[:user_id]).count
		matches = Match.where(match_finished: true)
			.where('winner = ? OR loser = ?', params[:user_id], params[:user_id])
			.order('started_at DESC').limit(10).reverse

		match_list = []
		matches.each{|m|
			match = m.as_json
			match["player_left"] = m.player_left.user_profile.nickname
			match["player_right"] = m.player_right.user_profile.nickname
			match_list.push(match);
		}
		return render plain: "Forbidden", status: :forbidden if info.blank?
		return render json: { user_id: info.user_id, name: info.name, 
			nickname: info.nickname, avatar_url: info.avatar_url, win: win, loss: loss, 
			status: info.status, matches: match_list, rp: info.rp
		}
	end
end
