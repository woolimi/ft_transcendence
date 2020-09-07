class GuildWarManageJob < ApplicationJob
  queue_as :default

  def perform(match_id)
    m = Match.find_by(id: match_id)
    return if m.blank?
    return if m.match_type != "war"
    return if m.started_at.present?

    if m.player_1.present? && m.player_2.blank?
      m.winner = m.player_1["user_id"]
      m.loser = nil
    elsif m.player_2.present? && m.player_1.blank? 
      m.winner = m.player_2["user_id"] 
      m.loser = nil
    end
    m.started_at = Time.now()
    m.match_finished = true
    m.save!()

    winner = UserProfile.find_by(user_id: m.winner)
    war = winner.guild.current_war
    if war.guild_1 == winner.guild_id
      war.guild_1_matches_won += 1
      war.guild_2_matches_unanswered += 1
      war.guild_2_matches_lost += 1
    end
    if war.guild_2 == winner.guild_id
      war.guild_2_matches_won += 1
      war.guild_1_matches_unanswered += 1
      war.guild_1_matches_lost += 1
    end
    if (war.guild_1_matches_unanswered == war.max_unanswered || war.guild_2_matches_unanswered == war.max_unanswered)
      war.end_date = Time.now()
      war.status = 3 # 3 - War Ended
    end    
    war.save!()
    ActionCable.server.broadcast("match_#{match_id}_channel", {end: true, data: m.jbuild() })
    ActionCable.server.broadcast("user_status_channel", {user_id: m.winner, status: 1 });
    ActionCable.server.broadcast("game_channel", {type: "match"});
  end
end
