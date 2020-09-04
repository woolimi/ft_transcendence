class Api::ChatMessagesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/chats/:chat_room/chat_messages/?last_message
	def index
		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			render json: messages_with_user(chat.chat_messages, params[:first_id]);
		elsif is_valide_room? params[:chat_room]
			chat = Chat.create({
				room: params[:chat_room],
				members: [
					{user_id: @u0.user_id, display: true, timestamp: Time.now},
					{user_id: @u1.user_id, display: true, timestamp: Time.now}
				]
			});
			render json: messages_with_user(chat.chat_messages, params[:first_id]);
		else
			render plain: "Page not found", status: :not_found
		end
	end

	# POST /api/chats/:chat_room/chat_messages/
	def create
		if params[:user_id] != current_user[:id]
			return render plain: "forbidden", status: :forbidden
		end
		if params[:content].length > 300
			return render plain: "message is too long", status: :forbidden
		end
		chat = Chat.find_by(room: params[:chat_room]);
		if chat.present?
			message = chat.chat_messages.create(
				user_id: params[:user_id],
				content: params[:content],
				timestamp: Time.now
			)
			ActionCable.server.broadcast "chat_#{params[:chat_room]}_channel", message
			chat.members.each { |m| 
				if m["user_id"] != current_user[:id]
					block_list = UserProfile.find_by(:user_id => m["user_id"]).block_list
					is_blocked = block_list.detect { |b| b == current_user[:id] }
					if !is_blocked
						data = {:type => "chats", :room => chat.room }
						ActionCable.server.broadcast "message_notification_#{m["user_id"]}_channel", data
					end
				end
			}
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

	def messages_with_user(messages, first_id)
		res = nil
		if first_id
			msgs = messages.select("chat_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url, user_profiles.guild_id")
					.joins("INNER JOIN user_profiles ON chat_messages.user_id = user_profiles.user_id")
					.where("chat_messages.id < ?", first_id)
					.order("chat_messages.timestamp DESC")
					.limit(20).reverse
		else
			msgs = messages.select("chat_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url, user_profiles.guild_id")
					.joins("INNER JOIN user_profiles ON chat_messages.user_id = user_profiles.user_id")
					.order("chat_messages.timestamp DESC")
					.limit(20).reverse
		end
		res = msgs.as_json
		res.each{ |r|
			r[:guild] = Guild.find_by(id: r["guild_id"]).as_json(only: [:anagram])
		}
		return res
	end
end
