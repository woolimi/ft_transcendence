class Api::WarOngoingController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
	
    # GET /api/war/:war_id/
	def show
		guild = current_user.user_profile.guild
		return render plain: "forbidden", status: :forbidden if guild.blank?
		return render plain: "forbidden", status: :forbidden if !guild.in_war?
		# war = guild.current_war
		# side = 0
		# side = -1 if war.guild_1 == guild.id
		# side = 1 if war.guild_2 == guild.id
		ongoing =  Match.where(war_id: params[:war_id]).where("started_at IS NOT NULL").where(match_finished: false)
		# if side == -1
		# 	ongoing = Match.where(war_id: params[:war_id]).where(match_finished: false).where.not(player_1: nil)
		# elsif side == 1
		# 	ongoing = Match.where(war_id: params[:war_id]).where(match_finished: false).where.not(player_2: nil)
		# end
		return render plain: "false", status: :ok if ongoing.empty?
		return render plain: "true", status: :ok 
    end
end
