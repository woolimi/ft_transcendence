class UserStatusChannel < ApplicationCable::Channel
  def subscribed
    user_status = UserProfile.find_by(user_id: current_user[:id])
    user_status.update(status: 1)
    data = {:user_id => current_user[:id], :status => 1}
    stream_from "user_status_channel"
    ActionCable.server.broadcast "user_status_channel", data
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    user_status = UserProfile.find_by(user_id: current_user[:id])
    user_status.update(status: 0)
    data = {:user_id => current_user[:id], :status => 0}
    ActionCable.server.broadcast "user_status_channel", data
  end
end
