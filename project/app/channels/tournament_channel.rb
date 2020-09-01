class TournamentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tournament_#{params[:tournament_id]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
