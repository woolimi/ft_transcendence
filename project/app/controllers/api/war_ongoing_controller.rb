class Api::WarOngoingController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!
	
    # GET /api/war/:war_id/
    def show
		ongoing = Match.where(war_id: params[:war_id]).where(match_finished: false)
		return render plain: "false", status: :ok if ongoing.empty?
		return render plain: "true", status: :ok 
    end
end
