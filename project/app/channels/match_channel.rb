class MatchChannel < ApplicationCable::Channel
  # match_id => {
  #   ball: {x, y, r, moveX, moveY, speed }
  #   score: [0, 0]
  #   player_1: {x, y} 10
  #   player_2: {x, y} 390
  #   user_ids: [..., ...]
  # }
  @@matches = {}
  @@DIRECTION = { :IDLE => 0, :UP => 1, :DOWN => 2, :LEFT => 3, :RIGHT => 4 }
  @@CANVAS = { :WIDTH => 400, :HEIGHT => 200 }
  @@PADDLE = { :WIDTH => 4, :HEIGHT => 20, :SPEED => 3 }
  def subscribed
    # stream_from "some_channel"
    stream_from "match_#{params[:match_id]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    quit_matches = Match.where('started_at IS NULL AND (player_1 @>? OR player_2 @>?)', 
      {"user_id": current_user[:id]}.to_json, {"user_id": current_user[:id]}.to_json)
    
    quit_matches.each {|m| 
      m.player_1 = nil if (m.player_1 && m.player_1["user_id"] == current_user[:id])
      m.player_2 = nil if (m.player_2 && m.player_2["user_id"] == current_user[:id])
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
    match.player_1["ready"] = data["ready_status"] if data["nb_player"] == 1
    match.player_2["ready"] = data["ready_status"] if data["nb_player"] == 2
    match.save();
    ActionCable.server.broadcast("match_#{data["match_id"]}_channel", data)
    if (match.player_1["ready"] && match.player_2["ready"])
      # set match started_at ...
      match.started_at = Time.now()
      match.save()
      ActionCable.server.broadcast("match_#{data["match_id"]}_channel", { all_ready: true })
      return game_start(match[:id], [match.player_1["user_id"], match.player_2["user_id"]])
    end
  end

  def game_data(data)
    return if !@@matches.has_key?(data["match_id"])
    return if current_user[:id] != data["from"]
    return if @@matches[data["match_id"]]["over"] == true
    player_nb = @@matches[data["match_id"]]["players"].find_index(data["from"]) + 1
    new_pos = @@matches[data["match_id"]]["player_#{player_nb}"].deep_dup
    new_pos["y"] -= @@PADDLE[:SPEED] if data["move"] == "up"
    new_pos["y"] += @@PADDLE[:SPEED] if data["move"] == "down"
    new_pos["y"] = 0 if new_pos["y"] < 0
    new_pos["y"] = @@CANVAS[:HEIGHT] - @@PADDLE[:HEIGHT] if new_pos["y"] > @@CANVAS[:HEIGHT] - @@PADDLE[:HEIGHT]
    @@matches[data["match_id"]]["player_#{player_nb}"] = new_pos
  end

  private
  def game_start(match_id, players)
    @@matches[match_id] = {
      "ball" => { "x" => @@CANVAS[:WIDTH] / 2, "y" => @@CANVAS[:HEIGHT] / 2, "r" => 3, "moveX" => @@DIRECTION[:IDLE], "moveY" => @@DIRECTION[:IDLE], "speed" => 3 },
      "score" => [0, 0],
      "player_1" => { "x" => 10, "y" => 90 },
      "player_2" => { "x" => 390, "y" => 90 },
      "players" => players,
      "over" => true,
    }

    # start loop
    @@matches[match_id]["over"] = true
    while(1) do
      sleep 0.01
      game = @@matches[match_id]
      p1 = @@matches[match_id]["player_1"]
      p2 = @@matches[match_id]["player_2"]

      if !@@matches[match_id]["over"]
        # if ball colides with the bound limits - correct the x and y coords.
        if (game["ball"]["x"] <= 0)
          @@matches[match_id]["over"] = true
          ball_reset(game["ball"])
          player_reset(game)
          game["score"][1] += 1
        end

        if (game["ball"]["x"] >= @@CANVAS[:WIDTH])
          ball_reset(game["ball"])
          player_reset(game)
          game["score"][0] += 1
          @@matches[match_id]["over"] = true
        end

        game["ball"]["moveY"] = @@DIRECTION[:UP] if (game["ball"]["y"] + game["ball"]["r"] >= @@CANVAS[:HEIGHT])
        game["ball"]["moveY"] = @@DIRECTION[:DOWN] if (game["ball"]["y"] - game["ball"]["r"] <= 0)

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
        if (game["ball"]["x"] - game["ball"]["r"] <= p2["x"] && game["ball"]["x"] >= p2["x"] - @@PADDLE[:WIDTH])
          if (game["ball"]["y"] <= p2["y"] + @@PADDLE[:HEIGHT] && game["ball"]["y"] + game["ball"]["r"] >= p2["y"])
            game["ball"]["x"] = (p2["x"] - game["ball"]["r"]);
            game["ball"]["moveX"] = @@DIRECTION[:LEFT];
          end
        end
      end # over false

      if (@@matches[match_id]["over"] == true)
        ActionCable.server.broadcast("match_#{match_id}_channel", {:score => game["score"]})
        match = Match.find_by(id: match_id)
        match.player_1["score"] = game["score"][0]
        match.player_2["score"] = game["score"][1]
        match.save()
        if (game["score"][0] == 3 || game["score"][1] == 3)
          # set winner, loser, finished
          match.winner = game["score"][0] > game["score"][1] ? match.player_1["user_id"] : match.player_2["user_id"]
          match.loser = game["score"][0] < game["score"][1] ? match.player_1["user_id"] : match.player_2["user_id"]
          match.match_finished = true
          match.save()
          break
        else
          ActionCable.server.broadcast("match_#{match_id}_channel", game)
          count_down(match_id)
          @@matches[match_id]["over"] = false
          ball_start(game["ball"])
          next
        end
      end
      ActionCable.server.broadcast("match_#{match_id}_channel", game)
    end # end while

    ActionCable.server.broadcast("match_#{match_id}_channel", {end: true})
    @@matches.delete(match_id)
  end

  def ball_reset(ball)
    ball["x"] = @@CANVAS[:WIDTH] / 2
    ball["y"] = @@CANVAS[:HEIGHT] / 2
    ball["moveX"] = @@DIRECTION[:IDLE]
    ball["moveY"] = @@DIRECTION[:IDLE]
  end

  def player_reset(game)
    game["player_1"] = { "x" => 10, "y" => 90 }
    game["player_2"] = { "x" => 390, "y" => 90 }
  end

  def ball_start(ball)
    ball["moveX"] = rand(0..1) == 1 ? @@DIRECTION[:LEFT] : @@DIRECTION[:RIGHT];
    ball["moveY"] = rand(0..1) == 1 ? @@DIRECTION[:UP] : @@DIRECTION[:DOWN];
  end

  def count_down(match_id)
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
