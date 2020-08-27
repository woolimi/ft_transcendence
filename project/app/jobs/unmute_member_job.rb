class UnmuteMemberJob < ApplicationJob
  queue_as :default

  def perform(channel_id)
    channel = Channel.find_by(id: channel_id)
    if (channel.present?)
      mutes = channel.mutes
      mutes.delete_if{ |m| m["timestamp"] < Time.now }
      data = { :mute => 1 } if channel.save()
			ActionCable.server.broadcast "channel_#{channel_id}_channel", data
    end
  end
end
