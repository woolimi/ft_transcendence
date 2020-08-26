class Api::GuildController < ApplicationController
    before_action :authenticate_user!

    def show
		allGuilds = Guild.select("id, name, anagram, total_score")
        render json: allGuilds
    end
    
    def update
      guild = Guild.new(name: params[:guildName], anagram: "xxxxx")
      guild.save()
      me = UserProfile.find_by(user_id: current_user[:id])
      me.guild_id = guild.id
      me.is_owner = true
      me.is_officer = true
      me.save()
    end
  end