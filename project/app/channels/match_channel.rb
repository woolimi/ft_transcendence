class MatchChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "match_#{params[:match_id]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    quit_matches = Match.where('started_at IS NULL AND (player1 @>? OR player2 @>?)', 
      {"user_id": current_user[:id]}.to_json, {"user_id": current_user[:id]}.to_json)
    
    quit_matches.each {|m| 
      m.player1 = nil if (m.player1 && m.player1["user_id"] == current_user[:id])
      m.player2 = nil if (m.player2 && m.player2["user_id"] == current_user[:id])
      m.save()
    }
    ActionCable.server.broadcast("match_#{params[:match_id]}_channel", {players: true, from: current_user[:id]})
  end

  def receive(data)
    ActionCable.server.broadcast("match_#{params[:match_id]}_channel", data)
  end

  def new_user
  end
end
