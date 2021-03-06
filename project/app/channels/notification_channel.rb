class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notification_channel_#{current_user.id}"
  end

  def unsubscribed
  end

  def send_notification(data)
    # NotificationChannel.broadcast_for(User.find_by(id: data["user_id"]),
    ActionCable.server.broadcast("notification_channel_#{data["user_id"]}",
    {
      type: data["type"],
      content: data["content"],
      from: data["from"],
    })
  end
end
