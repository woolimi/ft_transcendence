class Api::ChannelPasswordController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# POST /api/channels/:channel_id/password/
	def login
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		# check password
		if BCrypt::Password.new(channel.password) == params[:channel_password]
			session[params[:channel_id]] = channel.password
			return render plain: "ok", status: :ok
		else
			return render plain: "Unauthorized", status: :unauthorized
		end
	end

	# PUT /api/channels/:channel_id/password/
	def update
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		# Only owner can change password
		return render plain: "forbidden", status: :forbidden if channel.owner != current_user[:id]
		# validation
		if params[:channel_password].length > 0 && params[:channel_password].length < 6
			return render plain: "Password has to be at least 6 letters", status: :forbidden
		elsif params[:channel_password].length > 20
			return render plain: "Password is too long", status: :forbidden
		elsif params[:channel_password] != params[:re_channel_password]
			return render plain: "Passwords are not same", status: :forbidden
		end
		return render plain: :ok if channel.password.length > 0 && BCrypt::Password.new(channel.password) == params[:channel_password]
		channel.password = BCrypt::Password.create(params[:channel_password]);
		if channel.save()
			data = {:channel_password => "changed", :channel_id => params[:channel_id] }
			channel.members.each { |m|
				ActionCable.server.broadcast "message_notification_#{m["user_id"]}_channel", data if m["user_id"] != channel.owner
			}
			session[params[:channel_id]] = channel.password
			return render plain: "Successfully changed channel setting", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end

	# DELETE /api/channels/:channel_id/mutes/:user_id
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		return render plain: "forbidden", status: :forbidden if channel.blank?
		# Only owner can delete password
		return render plain: "forbidden", status: :forbidden if channel.owner != current_user[:id]
		# Remove user form bans
		channel.password = ""
		if channel.save()
			data = {:channel_password => "deleted" }
			channel.members.each { |m|
				ActionCable.server.broadcast "message_notification_#{m["user_id"]}_channel", data if m["user_id"] != channel.owner
			}
			session[params[:channel_id]] = ""
			return render plain: "Successfully changed channel setting", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end
end
