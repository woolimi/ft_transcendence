class MatchChannel < ApplicationCable::Channel
  # match_id => {
  #   ball: {x, y, r, moveX, moveY, speed }
  #   score: [0, 0]
  #   player_1: {x, y} 10
  #   player_2: {x, y} 390
  #   players: [uuid1, uuid2]
  # }

  @@matches = {}
  @@speed = 8
  @@CANVAS = { :WIDTH => 400, :HEIGHT => 200 }
  @@PADDLE = { :WIDTH => 4, :HEIGHT => 32, :SPEED => @@speed }
  @@session = {}

  def subscribed
    stream_from "match_#{params[:match_id]}_channel"
    m = Match.find_by(id: params[:match_id])
    @@session[current_user[:id]] = params[:match_id]
    info = current_user.user_profile
    if (params[:match_type] == "duel_friend" || params[:match_type].include?("tournament"))
      if (current_user[:id] == m.player_left_id)
        m.player_1 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id }
        m.save!()
      elsif (current_user[:id] == m.player_right_id)
        m.player_2 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id }
        m.save!()
      end
    elsif (params[:match_type] == "duel" || params[:match_type] == "ladder")
      if (m.player_1.nil?)
        m.player_1 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id }
        m.save!()
      elsif (m.player_2.nil?)
        m.player_2 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id }
        m.save!()
      end
    # war
    elsif (params[:match_type] == "war")
      if (m.war.guild_1 == current_user.user_profile.guild.id && m.player_1.nil?)
        m.player_1 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: true, guild_id: info.guild_id }
        m.save!()
      elsif (m.war.guild_2 == current_user.user_profile.guild.id && m.player_2.nil?)
        m.player_2 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: true, guild_id: info.guild_id }
        m.save!()
      end
      if (m.started_at.blank? && m.player_1.present? && m.player_2.present?)
        m.player_left_id = m.player_1["user_id"]
        m.player_right_id = m.player_2["user_id"]
        m.started_at = Time.now()
        m.save!()
        ActionCable.server.broadcast("match_#{params[:match_id]}_channel", { players: true, data: m.jbuild()})
        ActionCable.server.broadcast("match_#{params[:match_id]}_channel", { all_ready: true })
        return game_start(m.id, [m.player_left_id, m.player_right_id])
      else
        GuildWarManageJob.set(wait: 1.minutes).perform_later(params[:match_id])
      end
    end
    ActionCable.server.broadcast("match_#{params[:match_id]}_channel", {players: true, data: m.jbuild()}) if m.save()
  end

  def unsubscribed
    quit_match = Match.find_by(id: @@session[current_user[:id]])
    quit_match.player_1 = nil if (quit_match.player_1.present? && quit_match.player_1["user_id"] == current_user[:id])
    quit_match.player_2 = nil if (quit_match.player_2.present? && quit_match.player_2["user_id"] == current_user[:id])
    quit_match.save!()
    if (quit_match.match_type.include?("duel") || quit_match.match_type == "ladder" || quit_match.match_type == "war")
      return quit_match.delete if (quit_match.player_1.nil? && quit_match.player_2.nil? && quit_match.started_at.nil?)
    end
    ActionCable.server.broadcast("match_#{params[:match_id]}_channel", {players: true, data: quit_match.jbuild()})
  end

  def ready(data)
    match = Match.find_by(id: data["match_id"])
    pp match
    return if match.started_at.present?
    match.player_1["ready"] = data["ready_status"] if data["nb_player"] == 1
    match.player_2["ready"] = data["ready_status"] if data["nb_player"] == 2
    match.save();
    ActionCable.server.broadcast("match_#{data["match_id"]}_channel", data)
    if (match.player_1 && match.player_2 && match.player_1["ready"] && match.player_2["ready"])
      # set match started_at ...
      match.started_at = Time.now()
      match.player_left_id = match.player_1["user_id"]
      match.player_right_id = match.player_2["user_id"]
      match.save()
      ActionCable.server.broadcast("match_#{data["match_id"]}_channel", { all_ready: true })
      ActionCable.server.broadcast("match_#{data["match_id"]}_channel", { players: true, data: match.jbuild() })
      ActionCable.server.broadcast("game_channel", {type: "match"});
      return game_start(match[:id], [match.player_left_id, match.player_right_id])
    end
  end

  def game_data(data)
    # return if !@@matches.has_key?(data["match_id"])
    # return if current_user[:id] != data["from"]
    # return if @@matches[data["match_id"]]["over"] == true
    player_nb = @@matches[data["match_id"]]["players"].find_index(data["from"])
    return if player_nb.nil?
    @@matches[data["match_id"]]["player_#{player_nb + 1}"]["dir"] = data["move"]
  end

  private
  def game_start(match_id, players)
    @@matches[match_id] = {
      "ball" => { "x" => @@CANVAS[:WIDTH] / 2, "y" => @@CANVAS[:HEIGHT] / 2, "r" => 3, "moveX" => 0, "moveY" => 0, "speed" => @@speed },
      "score" => [0, 0],
      "player_1" => { "x" => 10, "y" => 90 },
      "player_2" => { "x" => 390, "y" => 90 },
      "players" => players,
      "over" => true,
    }

    # start loop
    @@matches[match_id]["over"] = true
    while(1) do
      sleep 0.02
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

        game["ball"]["moveY"] *= -1 if (game["ball"]["y"] + game["ball"]["r"] >= @@CANVAS[:HEIGHT])
        game["ball"]["moveY"] *= -1 if (game["ball"]["y"] - game["ball"]["r"] <= 0)

        game["ball"]["y"] += game["ball"]["moveY"] * game["ball"]["speed"] / 1.5
        game["ball"]["x"] += game["ball"]["moveX"] * game["ball"]["speed"] / 1.5

        # handle p1 - ball collision
        if (game["ball"]["x"] - game["ball"]["r"] <= p1["x"] && game["ball"]["x"] >= p1["x"] - @@PADDLE[:WIDTH])
          if (game["ball"]["y"] <= p1["y"] + @@PADDLE[:HEIGHT] && game["ball"]["y"] + game["ball"]["r"] >= p1["y"])
            game["ball"]["x"] = (p1["x"] + game["ball"]["r"])
            game["ball"]["moveX"] *= -1
          end
        end
        # handle p2 - ball collision
        if (game["ball"]["x"] - game["ball"]["r"] <= p2["x"] && game["ball"]["x"] >= p2["x"] - @@PADDLE[:WIDTH])
          if (game["ball"]["y"] <= p2["y"] + @@PADDLE[:HEIGHT] && game["ball"]["y"] + game["ball"]["r"] >= p2["y"])
            game["ball"]["x"] = (p2["x"] - game["ball"]["r"])
            game["ball"]["moveX"] *= -1
          end
        end

        ['player_1', 'player_2'].each do |player|
          temp = game[player]["y"]
          case game[player]['dir']
          when "up"
            temp -= @@PADDLE[:SPEED]
          when "down"
            temp += @@PADDLE[:SPEED]          
          end
          temp = 0 if temp < 0
          temp = @@CANVAS[:HEIGHT] - @@PADDLE[:HEIGHT] if temp > @@CANVAS[:HEIGHT] - @@PADDLE[:HEIGHT]
          game[player]['y'] = temp
        end
      end # over false

      if (@@matches[match_id]["over"] == true)
        ActionCable.server.broadcast("match_#{match_id}_channel", {:score => game["score"]})
        match = Match.find_by(id: match_id)
        match.score_left = game["score"][0]
        match.score_right = game["score"][1]
        match.save()
        if (game["score"][0] == 5 || game["score"][1] == 5)
          # set winner, loser, finished
          winner = game["score"][0] > game["score"][1] ? match.player_left.user_profile.as_json : match.player_right.user_profile.as_json
          loser = game["score"][0] < game["score"][1] ?  match.player_left.user_profile.as_json : match.player_right.user_profile.as_json
          match.winner = winner["user_id"]
          match.loser = loser["user_id"]
          match.score_left = game["score"][0]
          match.score_right = game["score"][1]
          match.match_finished = true
          match.save!()
          calculate_RP(winner, loser) if match.match_type == "ladder"
          calculate_GP_WP(winner, match.match_type)
          match.save!()
          match.update_tournament_after_match_ends()
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
    match = Match.find_by(id: match_id)
    ActionCable.server.broadcast("match_#{match_id}_channel", {end: true, data: match.jbuild() })
    ActionCable.server.broadcast("game_channel", {type: "match"});
    ActionCable.server.broadcast("user_status_channel", {user_id: match.player_left_id, status: 1 });
    ActionCable.server.broadcast("user_status_channel", {user_id: match.player_right_id, status: 1 });
    @@matches.delete(match_id)
  end

  def ball_reset(ball)
    ball["x"] = @@CANVAS[:WIDTH] / 2
    ball["y"] = @@CANVAS[:HEIGHT] / 2
    ball["moveX"] = 0
    ball["moveY"] = 0
  end

  def player_reset(game)
    game["player_1"] = { "x" => 10, "y" => 90 }
    game["player_2"] = { "x" => 390, "y" => 90 }
  end

  def ball_start(ball)
    ball["moveX"] = (rand(0..1) == 1 ? -1 : 1) * Math.cos(rand(45..60) * Math::PI / 180)
    ball["moveY"] = (rand(0..1) == 1 ? -1 : 1) * Math.sin(rand(45..60) * Math::PI / 180)
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
    data[:count] = "GO!"
    ActionCable.server.broadcast("match_#{match_id}_channel", data)
    sleep 1
  end

  def calculate_RP(winner, loser)
    w = UserProfile.find_by(user_id: winner["user_id"])
    l = UserProfile.find_by(user_id: loser["user_id"])
    if (l.rp - w.rp >= 200)
      bonus = (l.rp - w.rp) * 0.1
      w.rp = w.rp + 20 +  bonus
      l.rp = (l.rp - 20 - bonus < 0 ? 0 : l.rp - 20 - bonus)
    else
      w.rp = w.rp + 20
      l.rp = (l.rp - 20  < 0 ? 0 : l.rp - 20)
    end
    w.save();
    l.save();
  end


  #  1. Normal match (duel, ladder, tournament)
  # regardless wartime, earn 25 guild point
  # if guild in war, depends on addon, get 25 war point
  #  2.  War match
  # 50 war point

  # if winner has guild, give 25 point to his guild
  def calculate_GP_WP(winner, match_type)
    winner_guild = UserProfile.find_by(user_id: winner["user_id"]).guild
    # if winner has guild
    if winner_guild.present?
      winner_guild.total_score += 25
      winner_guild.save()
      # if winner's guild in war
      if winner_guild.in_war?
        winner_guild.current_war.calculate_WP(winner_guild.id, match_type)
        war = winner_guild.current_war
        if war.guild_1 == winner_guild.id
          war.guild_1_matches_won += 1
          war.guild_2_matches_lost += 1
          war.save!()
        elsif war.guild_2 == winner_guild.id
          war.guild_2_matches_won += 1
          war.guild_1_matches_lost += 1
          war.save!()
        end
      end

    end
  end
end

