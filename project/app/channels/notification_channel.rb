class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_notification(data)
    NotificationChannel.broadcast_to(User.find_by(id: data["user_id"]),
    {
      type: data["type"],
      content: data["content"],
      from: data["from"],
    })
  end
end
