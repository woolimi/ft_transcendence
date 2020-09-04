class Api::ChannelMembersController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/:channel_id/members/
	def index
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		if (current_user.user_profile.admin.blank? && channel.members.select{ |m| m["user_id"] == current_user[:id] }.blank?)
			return render plain: "you are not a member of this channel", status: :forbidden
		end
		if (current_user.user_profile.admin.blank? && channel.password.length > 0 && session[params[:channel_id]] != channel.password)
			return render plain: "Unauthorized", status: :unauthorized
		end

		members = channel.members.as_json
		members.each { |m| 
			user_profile = UserProfile.find_by(:user_id => m["user_id"])
			m["name"] = user_profile.name
			m["nickname"] = user_profile.nickname
			m["avatar_url"] = user_profile.avatar_url
		}
		render json: members, status: :ok
	end

	# PUT /api/channels/:channel_id/members/:user_id
	def update
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		return render plain: "forbidden", status: :forbidden if User.find_by(id: params[:user_id]).blank?
		# if channel is private, only member can invite other user
		if channel.channel_type == "private"
			me = channel.members.select{ |m| m["user_id"] == current_user[:id] }
			return render plain: "forbidden", status: :forbidden if me.blank?
		end
		# if channel is public, anyone can join to channel
		me = channel.members.select{ |m| m["user_id"] == params[:user_id] }
		return render plain: "Already joined to this channel", status: :ok if me.present?
		channel.members.push({ "user_id" => params[:user_id], "timestamp" => Time.now })
		data = {:member => params[:user_id], :channel_name => channel.room }
		ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
		ActionCable.server.broadcast "message_notification_#{params["user_id"]}_channel", data
		return render plain: "Successfully joined to channel", status: :ok if channel.save()
	end
	# DELETE /api/channels/:channel_id/members/:user_id
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		return render plain: "forbidden", status: :forbidden if User.find_by(id: params[:user_id]).blank?
		# only user himself can quit
		return render plain: "forbidden", status: :forbidden if (params[:user_id] != current_user[:id])
		# only member can quit
		return render plain: "forbidden", status: :forbidden if channel.members.select { |m| m["user_id"] == current_user[:id]}.blank?

		# if owner want to quit
		if (channel.owner == current_user[:id])
			channel.members.delete_if { |m| m["user_id"] == params[:user_id] }
			if channel.members.empty?
				channel.destroy
				return render plain: "Successfully quit channel", status: :ok
			end
			channel.owner = channel.members[0]["user_id"]
			channel.admins.delete_if { |m| m == params[:user_id] }
			if channel.save()
				data = {:member => params[:user_id] }
				ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
				return render plain: "Successfully quit channel", status: :ok
			else
				return render json: nil, status: :internal_server_error
			end
		end
		# if admin or normal user want to quit
		channel.members.delete_if { |m| m["user_id"] == current_user[:id] }
		channel.admins.delete_if { |m| m == current_user[:id] }
		if channel.save()
			data = {:member => current_user[:id] }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully quit channel", status: :ok
		else
			return render plain: "Internal server error", status: :internal_server_error
		end
	end
end
