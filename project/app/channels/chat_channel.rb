class ChatChannel < ApplicationCable::Channel
  def subscribed
    if params[:room].split("_").include? current_user[:id]
      stream_from "chat_#{params[:room]}_channel"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end