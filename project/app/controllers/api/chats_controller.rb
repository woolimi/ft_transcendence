class Api::ChatsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# PUT /api/chats/:chat_room/last_visited
	def update_last_visited
		chat = Chat.find_by(room: params[:chat_room])
		me = chat.members.find { |m| m["user_id"] == current_user[:id] }
		me["timestamp"] = Time.now
		if chat.save()
			render json: nil, status: :ok
		else
			render json: nil, status: :internal_server_error
		end
	end

	# PUT /api/chats/:chat_room/display/:display
	def update_display
		chat = Chat.find_by(room: params[:chat_room])
		me = chat.members.find { |m| m["user_id"] == current_user[:id] }
		me["display"] = (params[:display] == "true") # string to boolean
		if chat.save()
			render json: nil, status: :ok
		else
			render json: nil, status: :internal_server_error
		end
	end
end
