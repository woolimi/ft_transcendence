class Api::ChatMembersController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/chats/:chat_room/members/index
	def index
		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			render json: add_info(chat.members)
		else
			render json: nil, status: :forbidden
		end
	end

	private
	def add_info members
		members.each { |m| 
			user_profile = UserProfile.find_by(:user_id => m["user_id"])
			m["name"] = user_profile.name
			m["nickname"] = user_profile.nickname
			m["avatar_url"] = user_profile.avatar_url
		}
		return members
	end
end
