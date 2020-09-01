class GuildChannel < ApplicationCable::Channel
  def subscribed
    stream_from "guild_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    ActionCable.server.broadcast("guild_channel", data)
  end
end
