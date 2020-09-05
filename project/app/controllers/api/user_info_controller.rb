class Api::UserInfoController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/user_info/?search=:name_or_nickname
	def index
		if params[:search]
			render json: UserProfile.search(params[:search], current_user)
		end
	end

	# GET /api/user_info/:user_id
	def show
		p = UserProfile.find_by(user_id: params[:user_id])
		info = p.as_json(only: [:user_id, :name, :nickname, :avatar_url, :status, :rp])
		info[:win] = Match.where(winner: params[:user_id]).count
		info[:loss] = Match.where(loser: params[:user_id]).count
		matches = Match.where(match_finished: true)
			.where('winner = ? OR loser = ?', params[:user_id], params[:user_id])
			.order('started_at DESC').limit(10).reverse
		match_list = []
		matches.each{|m|
			match = m.as_json
			match["match_type"] = "tournament" if m.match_type.include?("tournament")
			match["player_left"] = m.player_left.user_profile.nickname
			match["player_right"] = m.player_right.user_profile.nickname
			match_list.push(match);
		}
		info[:matches] = match_list
		info[:guild] = p.guild.as_json if p.guild_id.present?
		info[:guild] = nil if p.guild_id.blank?
		return render plain: "Forbidden", status: :forbidden if info.blank?
		return render json: info
	end

	# GET /api/user_info/show_all
	def show_all
		return render 'you are not admin', status: :forbidden if !current_user.user_profile.admin
		users = UserProfile
			.order(:name)
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
		info.user.send_notification('banned', {})
	end

	# PUT /api/user_info/:id/unban
	def unban
		info = UserProfile.find_by(user_id: params[:user_id])
		info.banned = false
		info.save
		info.user.send_notification('unbanned', {})
	end
end
