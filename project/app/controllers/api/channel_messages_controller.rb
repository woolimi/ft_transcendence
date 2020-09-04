class Api::ChannelMessagesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/:channel_id/chat_messages/?first_id=1
	def index
		channel = Channel.find_by(id: params[:channel_id]);
		render plain: "Not found", status: :not_found if channel.blank?
		if (current_user.user_profile.admin.blank? && channel.password.length > 0 && session[params[:channel_id]] != channel.password)
			return render plain: "Unauthorized", status: :unauthorized
		end
		render json: messages_with_user(channel.channel_messages, params[:first_id]);
	end

	# POST /api/channels/:channel_id/chat_messages/
	def create
		return render plain: "Forbidden", status: :forbidden if params[:user_id] != current_user[:id]
		return render plain: "Message is too long", status: :forbidden if params[:content].length > 300
		channel = Channel.find_by(id: params[:channel_id]);
		return render plain: "Forbidden", status: :forbidden if channel.blank?
		if channel.members.select{|m| m["user_id"] == current_user[:id]}.blank?
			return render plain: "You are not a member", status: :forbidden
		end
		if channel.password.length > 0 && session[params[:channel_id]] != channel.password
			return render plain: "Unauthorized", status: :unauthorized
		end
		message = channel.channel_messages.create(
			user_id: params[:user_id],
			content: params[:content],
			timestamp: Time.now
		)
		return render plain: "internal server error", status: :internal_server_error if message.blank?
		data = {:message => message }
		ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
		channel.members.each { |m| 
			if m["user_id"] != current_user[:id]
				is_blocked = channel.bans.select{ |b| b == current_user[:id] }.present?
				if !is_blocked
					data = {:type => "channels", :channel_id => channel.id }
					ActionCable.server.broadcast "message_notification_#{m["user_id"]}_channel", data
				end
			end
		}
		render json: nil, status: :ok
	end

	private
	def messages_with_user(messages, first_id)
		res = nil
		if first_id
			msgs = messages.select("channel_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url, user_profiles.guild_id")
					.joins("INNER JOIN user_profiles ON channel_messages.user_id = user_profiles.user_id")
					.where("channel_messages.id < ?", first_id)
					.order("channel_messages.timestamp DESC")
					.limit(20).reverse
		else
			msgs = messages.select("channel_messages.*, user_profiles.name, user_profiles.nickname, user_profiles.avatar_url, user_profiles.guild_id")
					.joins("INNER JOIN user_profiles ON channel_messages.user_id = user_profiles.user_id")
					.order("channel_messages.timestamp DESC")
					.limit(20).reverse
		end
		res = msgs.as_json
		res.each{ |r|
			r[:guild] = Guild.find_by(id: r["guild_id"]).as_json(only: [:anagram])
		}
		return res
	end
end
