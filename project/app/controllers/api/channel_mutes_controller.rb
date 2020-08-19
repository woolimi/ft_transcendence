class Api::ChannelMutesController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# PUT /api/channels/:channel_id/mutes/:user_id
	def update
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner or admin can ban user
		return render json: nil, status: :forbidden if channel.owner != current_user[:id] && channel.admins.select{ |a| a == current_user[:id]}.blank?
		# Add user into bans
		channel.mutes.push({:user_id => params[:user_id], :timestamp => 1.minutes.from_now(Time.now) }) if channel.mutes.select{|b| b["user_id"] == params[:user_id]}.blank?
		if channel.save()
			data = {:mute => params[:user_id] }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			UnmuteMemberJob.set(wait: 1.minutes).perform_later(params[:channel_id])
			return render plain: "Successfully mute user", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end

	# DELETE /api/channels/:channel_id/mutes/:user_id
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner or admin can ban user
		return render json: nil, status: :forbidden if channel.owner != current_user[:id] && channel.admins.select{ |a| a == current_user[:id]}.blank?
		# Remove user form bans
		channel.mutes.delete_if { |m| m["user_id"] == params[:user_id] }
		if channel.save()
			data = {:mute => params[:user_id] }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully unmute user", status: :ok
		else
			return render json: nil, status: :internal_server_error
		end
	end
end
