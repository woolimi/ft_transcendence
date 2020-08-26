class MatchChannel < ApplicationCable::Channel
  # match_id => {
  #   ball: {x: 0, y: 0}
  #   player1: {x: 0, y: 0, user_id: ...}
  #   player2: {x: 0, y: 0, user_id: ...}
  #   score: [0, 0]
  # }
  @@matches = {}
  @@DIRECTION = { :IDLE => 0, :UP => 1, :DOWN => 2, :LEFT => 3, :RIGHT => 4 }
  @@CANVAS = { :WIDTH => 400, :HEIGHT => 200 }
  @@PADDLE = { :WIDTH => 4, :HEGIHT => 20 }
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

  def ready(data)
    match = Match.find_by(id: data["match_id"])
    return if match.started_at.present?
    match.player1["ready"] = data["ready_status"] if data["nb_player"] == 1
    match.player2["ready"] = data["ready_status"] if data["nb_player"] == 2
    match.save();
    ActionCable.server.broadcast("match_#{data["match_id"]}_channel", data)
    if (match.player1["ready"] && match.player2["ready"])
      # set match started_at ...
      ActionCable.server.broadcast("match_#{data["match_id"]}_channel", { all_ready: true })
      return game_start(match[:id])
    end
  end

  def game_data(data)
    return if !@@matches.has_key?(data.match_id)
    return if current_user[:id] != data["from"]
    @@matches[data["match_id"]][data["from"]] = data["from"];
  end

  private
  def game_start(match_id)
    @@matches[match_id] = {
      "ball" => { "x" => @@CANVAS[:WIDTH] / 2, "y" => @@CANVAS[:HEIGHT] / 2, "r" => 3, "moveX" => @@DIRECTION[:IDLE], "moveY" => @@DIRECTION[:IDLE], "speed" => 3 },
      "score" => [0, 0],
      "player1" => { "x" => 10, "y" => 90 },
      "player2" => { "x" => 390, "y" => 90 }
    }
    count_down(match_id)

    return 
    # start loop
    scored = false
    while(1) do
      game = @@matches[match_id]
      p1 = @@matches[match_id]["player1"]
      p2 = @@matches[match_id]["player2"]

      # if ball colides with the bound limits - correct the x and y coords.
      if (game["ball"]["x"] <= 0)
        ball_reset(game["ball"])
        game["score"][1] += 1
        scored = true
      end

      if (game["ball"]["x"] >= @@CANVAS[:WIDTH])
        ball_reset(game["ball"])
        game["score"][0] += 1
        scored = true
      end
      
      game["ball"]["moveY"] = @@DIRECTION[:UP] if (game["ball"]["y"] >= CANVAS.HEIGHT)
      game["ball"]["moveY"] = @@DIRECTION[:DOWN] if (game["ball"]["y"] <= 0)

      game["ball"]["y"] -= game["ball"]["speed"] / 1.5 if game["ball"]["moveY"] == @@DIRECTION[:UP]
      game["ball"]["y"] += game["ball"]["speed"] / 1.5 if game["ball"]["moveY"] == @@DIRECTION[:DOWN]
      game["ball"]["x"] -= game["ball"]["speed"] / 1.5 if game["ball"]["moveX"] == @@DIRECTION[:LEFT]
      game["ball"]["x"] += game["ball"]["speed"] / 1.5 if game["ball"]["moveX"] == @@DIRECTION[:RIGHT]

      # handle p1 - ball collision
			if (game["ball"]["x"] - game["ball"]["r"] <= p1["x"] && game["ball"]["x"] >= p1["x"] - @@PADDLE[:WIDTH])
				if (game["ball"]["y"] <= p1["y"] + @@PADDLE[:HEIGHT] && game["ball"]["y"] + game["ball"]["r"] >= p1["y"])
					game["ball"]["x"] = (p1["x"] + game["ball"]["r"]);
					game["ball"]["moveX"] = @@DIRECTION[:RIGHT];
        end
			end
      # handle p2 - ball collision
			if (game["ball"]["x"] - game["ball"].r <= p2["x"] && game["ball"]["x"] >= p2["x"] - @@PADDLE[:WIDTH])
				if (game["ball"]["y"] <= p2["y"] + @@PADDLE[:HEIGHT] && game["ball"]["y"] + game["ball"].r >= p2["y"])
					game["ball"]["x"] = (p2["x"] - game["ball"]["r"]);
					game["ball"]["moveX"] = @@DIRECTION[:LEFT];
        end
      end
      
      ActionCable.server.broadcast("match_#{game["match_id"]}_channel", game)
      if (scored == true)
        if (game["score"][0] == 3 || game["score"][1] == 3)
          # set winner, loser, finished
          break
        elsif
          scored = false
          count_down(match_id)
          ball_start()
        end
      end
    end # end while
    ActionCable.server.broadcast("match_#{game["match_id"]}_channel", "#some data here")
    @@matches.delete(match_id)
  end

  def ball_reset(ball)
    ball["x"] = @@CANVAS[:WIDTH] / 2
    ball["y"] = @@CANVAS[:HEIGHT] / 2
    ball["moveX"] = @@DIRECTION[:IDLE]
    ball["moveY"] = @@DIRECTION[:IDLE]
  end

  def ball_start(ball)
    ball["moveX"] = rand(0..1) ? @@DIRECTION[:LEFT] : @@DIRECTION[:RIGHT];
		ball["moveY"] = rand(0..1) ? @@DIRECTION[:UP] : @@DIRECTION[:DOWN];
  end

  def count_down(match_id)
    sleep 1
    data = { count_down: true, count: 3 }
    ActionCable.server.broadcast("match_#{match_id}_channel", data)
    sleep 1
    data[:count] = 2
    ActionCable.server.broadcast("match_#{match_id}_channel", data)
    sleep 1
    data[:count] = 1
    ActionCable.server.broadcast("match_#{match_id}_channel", data)
    sleep 1
    data[:count] = "GO"
    ActionCable.server.broadcast("match_#{match_id}_channel", data)
    sleep 1
  end
end
