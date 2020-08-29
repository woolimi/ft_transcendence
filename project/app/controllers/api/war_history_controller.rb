class Api::WarHistoryController < ApplicationController
    before_action :authenticate_user!
    def show
        war = War.where(guild_1: params[:guild_id]).or(War.where(guild_2: params[:guild_id])).order("end_date DESC")
        war.each do |i|
            i[:guild_1] = Guild.find_by(id: i[:guild_1])[:name]
            i[:guild_2] = Guild.find_by(id: i[:guild_2])[:name]
        end
        render json: war
    end 
end