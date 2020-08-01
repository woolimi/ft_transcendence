class UserStatusChannel < ApplicationCable::Channel
  def subscribed
    stream_from "user_status_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    user_status = UserStatus.find_by(user_id: current_user[:id])
    user_status.update(status: 0)
    data = {:user_id => current_user[:id], :status => 0}.to_json
    ActionCable.server.broadcast "user_status_channel", data
  end
end
