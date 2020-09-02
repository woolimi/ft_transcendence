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

	# GET /api/user_info/show_all
	def show_all
		return render 'you are not admin', status: :forbidden if !current_user.user_profile.admin
		users = UserProfile
			.where.not(user_id: current_user[:id])
			.where(admin: false)
			.as_json(only: [:user_id, :name, :nickname, :avatar_url, :banned])
		return render json: users, status: :ok
	end

	# PUT /api/user_info/:id/ban
	def ban
		info = UserProfile.find_by(user_id: params[:user_id])
		info.banned = true
		info.save
	end

	# PUT /api/user_info/:id/unban
	def unban
		info = UserProfile.find_by(user_id: params[:user_id])
		info.banned = false
		info.save
	end
end
