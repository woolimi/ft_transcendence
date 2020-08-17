class Api::ChannelBansController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# PUT /api/channels/:channel_id/bans/:user_id
	def update
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner or admin can ban user
		return render json: nil, status: :forbidden if channel.owner != current_user[:id] && channel.admins.select{ |a| a.user_id == current_user[:id]}.blank?
		# Add user into bans
		channel.bans.push(params[:user_id]) if channel.bans.select{|b| b == params[:user_id]}.blank?
		if channel.save()
			data = {:ban => params[:user_id] }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully banned user", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner or admin can ban user
		return render json: nil, status: :forbidden if channel.owner != current_user[:id] && channel.admins.select{ |a| a.user_id == current_user[:id]}.blank?
		# Remove user form bans
		channel.bans.delete_if { |m| m == params[:user_id] }
		if channel.save()
			data = {:ban => params[:user_id] }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully deleted user from baned list", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end
end
