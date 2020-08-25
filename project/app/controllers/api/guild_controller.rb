class Api::GuildController < ApplicationController
    before_action :authenticate_user!

    def show
		allGuilds = Guild.select("id, name, anagram, total_score")
        puts ">>>>>>>>>>>>"
        puts allGuilds.as_json
        puts ">>>>>>>>>>>>"
        render json: allGuilds
	end
end