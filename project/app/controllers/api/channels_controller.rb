class Api::ChannelsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/
	def index
		# find channels where user is
		channels = Channel.where("members @> ?", [{"user_id": "#{current_user[:id]}" }].to_json)
		ch_messages = channels.select("channels.*, channel_messages.*")
				.joins("INNER JOIN channel_messages ON channels.id = channel_messages.channel_id")
				.where.not("channel_messages.user_id = ?", current_user[:id])
				.order("chat_messages.timestamp ASC")
		channels.each { |channel|
			me = channel.members.find { |m| m["user_id"] == current_user[:id] }
			unread = ch_messages.where("channel_messages.timestamp > ?", me["timestamp"]).size
			channel.members.each{ |m|
				user_profile = UserProfile.find_by(:user_id => m["user_id"])
				m["name"] = user_profile[:name]
				m["nickname"] = user_profile[:nickname]
				m["avatar_url"] = user_profile[:avatar_url]
				m["unread"] = unread
			}
		}
		
		# find user where user is
		chats = Chat.where("room LIKE ?", "%#{current_user[:id]}%")
		messages = chats.select("chats.*, chat_messages.*")
				.joins("INNER JOIN chat_messages ON chats.id = chat_messages.chat_id")
				.where.not("chat_messages.user_id = ?", current_user[:id])
				.order("chat_messages.timestamp ASC")

		chats.each { |chat|
			me = chat.members.find { |m| m["user_id"] == current_user[:id] }
			# chat.members.me vs chat_messages.timestamp
			unread = messages.where("chat_messages.timestamp > ?", me["timestamp"]).size
			chat.members.each { |m|
				user_profile = UserProfile.find_by(:user_id => m["user_id"])
				m["name"] = user_profile[:name]
				m["nickname"] = user_profile[:nickname]
				m["avatar_url"] = user_profile[:avatar_url]
				m["unread"] = unread
			}
		}
		render json: {
			channels: channels, 
			chats: chats,
		}
	end

	# POST /api/channels/:room
	def create
		if params[:room].length == 0
			return render plain: "Please type channel name", status: :forbidden
		elsif params[:room].length < 3
			return render plain: "Channel name has to be more than 4 letters", status: :forbidden
		elsif params[:password].length > 0 && params[:password].length < 6
			return render plain: "Password has to be at least 6 letters", status: :forbidden
		elsif params[:password] != params[:repassword]
			return render plain: "Passwords are not same", status: :forbidden
		end
		channel = Channel.find_by(room: params[:room])
		if channel.present?
			return render plain: "Channel name #{params[:room]} is already exist", status: :forbidden
		end
		new_channel = Channel.create({
			room: params[:room],
			channel_type: params[:channel_type],
			password: (params[:password].length > 0 ? BCrypt::Password.create(params[:password]) : ""),
			owner: {"user_id" => current_user[:id]},
			admins: [],
			members: [{"user_id" => current_user[:id], "timestamp" => Time.now }],
			bans: [],
			mutes: []
		})
		render plain: nil, status: :ok
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
