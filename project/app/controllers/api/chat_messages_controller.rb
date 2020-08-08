class Api::ChatMessagesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/chats/:chat_room/chat_messages/
	def index
		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			render json: messages_with_user(chat.chat_messages);
		elsif is_valide_room? params[:chat_room]
			chat = Chat.create({
				room: params[:chat_room],
				members: [
					{user_id: @u0.user_id, name: @u0.name, nickname: @u0.nickname, avatar_url: @u0.avatar_url, timestamp: Time.now.to_i},
					{user_id: @u1.user_id, name: @u1.name, nickname: @u1.nickname, avatar_url: @u1.avatar_url, timestamp: Time.now.to_i}
				]
			});
			render json: messages_with_user(chat.chat_messages);
		else
			render plain: "Page not found", status: :not_found
		end
	end

	# POST /api/chats/:chat_room/chat_messages/
	def create
		if params[:user_id] != current_user[:id]
			render plain: "Page not found", status: :not_found
			return
		end

		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			message = chat.chat_messages.create(
				user_id: params[:user_id],
				content: params[:content]
			)
			ActionCable.server.broadcast "chat_#{params[:chat_room]}_channel", message
			render json: nil, status: :ok
		else
			render plain: "Page not found", status: :not_found
		end
	end

	private
	def is_valide_room? room
		users = room.split("_");
		if !users.include?(current_user[:id])
		return false;
		end
		@u0 = UserProfile.find_by(user_id: users[0]);
		@u1 = UserProfile.find_by(user_id: users[1]);
		if @u0.blank? || @u1.blank?
		return false;
		end
		return true
	end

	def messages_with_user messages
		return messages.select("chat_messages.*, user_profiles.nickname, user_profiles.avatar_url")
					.joins("INNER JOIN user_profiles ON chat_messages.user_id = user_profiles.user_id")
					.order("chat_messages.created_at ASC")
	end
end
