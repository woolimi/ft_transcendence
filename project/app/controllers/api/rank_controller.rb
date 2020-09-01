class Api::RankController < ApplicationController
	def index
		return render json: UserProfile.order("rp DESC").limit(10).as_json(only: [:user_id, :name, :nickname, :avatar_url, :rp]), status: :ok
	end
end
