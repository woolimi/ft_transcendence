class Api::ChannelMembersController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET /api/channels/:channel_id/members
	def index
		channel = Channel.find_by(id: params[:channel_id])
		if channel.present?
			members = channel.members
			members.each { |m| 
				user_profile = UserProfile.find_by(:user_id => m["user_id"])
				m["name"] = user_profile.name
				m["nickname"] = user_profile.nickname
				m["avatar_url"] = user_profile.avatar_url
			}
			render json: members, status: :ok
		else
			render json: nil, status: :forbidden
		end
	end

	# PUT /api/channels/:channel_id/members/:user_id
	def update
		channel = Channel.find_by(id: params[:channel_id])
		if (params[:user_id] != current_user[:id]) && (channel.owner != current_user[:id]) && (channel.admins.select{ |a| a.user_id == current_user[:id]}.blank?)
			return render json: nil, status: :forbidden
		end

		if channel.present?
			me = channel.members.select{ |m| m["user_id"] == params[:user_id] }
			return render plain: "You have aleady joined to this channel", status: :ok if me.present?
			channel.members.push({ "user_id" => params[:user_id], "timestamp" => Time.now })
			return render plain: "Successfully joined to channel", status: :ok if channel.save()
		else
			render plain: "channel doesn't exist", status: :forbidden
		end
	end
	# DELETE /api/channels/:channel_id/members/:user_id
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		if (params[:user_id] != current_user[:id]) && (channel.owner != current_user[:id]) && (channel.admins.select{ |a| a.user_id == current_user[:id]}.blank?)
			return render json: nil, status: :forbidden
		end

		if channel.present?
			me = channel.members.select { |m| m["user_id"] == params[:user_id]}
			return render plain: "You have already quit this channel", status: :ok if me.blank?
			channel.members.delete_if { |m| m["user_id"] == params[:user_id] }
			return render plain: "Successfully quit channel", status: :ok if channel.save()
		else
			render plain: "channel doesn't exist", status: :forbidden
		end
	end
end
