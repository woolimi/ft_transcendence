class MessageNotificationChannel < ApplicationCable::Channel
  def subscribed
    if (params[:user_id] == current_user[:id])
      stream_from "message_notification_#{params[:user_id]}_channel"
    else
      reject_unauthorized_connection
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
