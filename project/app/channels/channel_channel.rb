class ChannelChannel < ApplicationCable::Channel
  def subscribed
    stream_from "channel_#{params[:channel_id]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
