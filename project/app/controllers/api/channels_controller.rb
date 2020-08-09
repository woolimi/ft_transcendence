class Api::ChannelsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/
	def index
		# find in channel
		# find in chat
		chats = Chat.where("room LIKE ?", "%#{current_user[:id]}%")
		messages = chats.select("chats.*, chat_messages.*")
				.joins("INNER JOIN chat_messages ON chats.id = chat_messages.chat_id")
				.where.not("chat_messages.user_id = ?", current_user[:id])
				.order("chat_messages.timestamp ASC")

		chats.each { |chat|
			me = chat.members.find { |m| m["user_id"] == current_user[:id] }
			# chat.members.me vs chat_messages.timestamp
			unread = messages.where("chat_messages.timestamp > ?", me["timestamp"]).size
			# chat[:unread]
			chat[:unread] = unread
		}
		render json: {
			# channels: channels.to_json, 
			chats: chats,
		}
	end

	# GET /api/channels/:room/last_visited
	def last_visited
		chat = Chat.find_by(room: params[:channel_room])
		me = chat.members.find { |m| m["user_id"] == current_user[:id] }
		render json:  me["timestamp"]
	end

	# PUT /api/channels/:channel_room/last_visited
	def update_last_visited
		chat = Chat.find_by(room: params[:channel_room])
		me = chat.members.find { |m| m["user_id"] == current_user[:id] }
		me["timestamp"] = Time.now
		if chat.save()
			render json: nil, status: :ok
		else
			render json: nil, status: :internal_server_error
		end
	end

	# PUT /api/channels/:channel_room/display/:display
	def update_display
		chat = Chat.find_by(room: params[:channel_room])
		me = chat.members.find { |m| m["user_id"] == current_user[:id] }
		me["display"] = (params[:display] == "true") # string to boolean
		if chat.save()
			render json: nil, status: :ok
		else
			render json: nil, status: :internal_server_error
		end
	end
end
