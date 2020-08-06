class Api::ChatMembersController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/chats/:chat_room/members/index
	def index
		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			render json: chat.members;
		else
			render json: nil, status: :forbidden
		end
	end
end
