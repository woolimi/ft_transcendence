class Api::ChannelMessagesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/:channel_id/chat_messages/?first_id=1
	def index
		channel = Channel.find_by(id: params[:channel_id]);
		if channel.present?
			render json: messages_with_user(channel.channel_messages, params[:first_id]);
		else
			render plain: "Page not found", status: :not_found
		end
	end

	# POST /api/chats/:channel_id/chat_messages/
	def create
		if params[:user_id] != current_user[:id]
			return render plain: "forbidden", status: :forbidden
		end
		if params[:content].length > 300
			return render plain: "message is too long", status: :forbidden
		end
		channel = Channel.find_by(id: params[:channel_id]);
		if channel.present?
			message = channel.channel_messages.create(
				user_id: params[:user_id],
				content: params[:content],
				timestamp: Time.now
			)
			# ActionCable.server.broadcast "chat_#{params[:channel_id]}_channel", message
			# channel.members.each { |m| 
			# 	if m["user_id"] != current_user[:id]
			# 		block_list = UserProfile.find_by(:user_id => m["user_id"]).block_list
			# 		is_blocked = block_list.detect { |b| b == current_user[:id] }
			# 		if !is_blocked
			# 			data = {:type => "chats", :room => channel.room }
			# 			ActionCable.server.broadcast "message_notification_#{m["user_id"]}_channel", data
			# 		end
			# 	end
			# }
			render json: nil, status: :ok
		else
			render plain: "Page not found", status: :not_found
		end
	end

	private
	def messages_with_user(messages, first_id)
		if first_id
			return messages.select("channel_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url")
					.joins("INNER JOIN user_profiles ON channel_messages.user_id = user_profiles.user_id")
					.where("channel_messages.id < ?", first_id)
					.order("channel_messages.timestamp DESC")
					.limit(20).reverse
		else
			return messages.select("channel_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url")
					.joins("INNER JOIN user_profiles ON channel_messages.user_id = user_profiles.user_id")
					.order("channel_messages.timestamp DESC")
					.limit(20).reverse
		end
	end
end
