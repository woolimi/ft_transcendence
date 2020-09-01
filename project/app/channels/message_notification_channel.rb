class MessageNotificationChannel < ApplicationCable::Channel
  def subscribed
    reject_unauthorized_connection if params[:user_id] != current_user[:id]
    stream_from "message_notification_#{params[:user_id]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
