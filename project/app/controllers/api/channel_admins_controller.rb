class Api::ChannelAdminsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# PUT /api/channels/:channel_id/admins/:user_id
	def update
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner can designate admin 
		if (current_user.user_profile.admin.blank? && channel.owner != current_user[:id]))
			return render json: nil, status: :forbidden
		end
		# Only user in members can be admin
		u = channel.members.select{ |m| m["user_id"] == params[:user_id] }
		return render json: nil, status: :forbidden if u.blank?
		# Add user into admins
		channel.admins.push(params[:user_id])
		if channel.save()
			data = {:admin => params[:user_id], :channel_id => params[:channel_id], :result => true }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully designated user as admin", status: :ok if channel.save()
		end
		return render json: nil, status: :internal_server_error
	end
	def destroy
		channel = Channel.find_by(id: params[:channel_id])
		return render json: nil, status: :forbidden if channel.blank?
		# Only owner can delete admin 
		if (current_user.user_profile.admin.blank? && channel.owner != current_user[:id]))
			return render json: nil, status: :forbidden
		end
		# Find user in admins and delete
		channel.admins.delete_if { |m| m == params[:user_id] }
		if channel.save()
			data = {:admin => params[:user_id], :channel_id => params[:channel_id], :result => false }
			ActionCable.server.broadcast "channel_#{params[:channel_id]}_channel", data
			return render plain: "Successfully deleted user from admins", status: :ok if channel.save()
		end
		return render json: nil, status: :internal_server_error
	end
end
