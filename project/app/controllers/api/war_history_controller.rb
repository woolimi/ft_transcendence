class Api::WarHistoryController < ApplicationController
    before_action :authenticate_user!
    def show
        war = War.where(guild_1: params[:guild_id]).or(War.where(guild_2: params[:guild_id]))
        puts war.as_json
        render json: war
    end 
end