class Api::WarHistoryController < ApplicationController
    before_action :authenticate_user!
    def show
        war = War.where(guild_1: params[:guild_id]).or(War.where(guild_2: params[:guild_id])).order("end_date DESC")
        war.each do |i|
            name = Guild.find_by(id: i[:guild_1])
            if name.nil?
                i[:guild_1] = "Deleted Guild"
            else
                i[:guild_1] = name[:name]
            end
            name = Guild.find_by(id: i[:guild_2])
            if name.nil?
                i[:guild_2] = "Deleted Guild"
            else
                i[:guild_2] = name[:name]
            end
        end
        render json: war
    end 
end