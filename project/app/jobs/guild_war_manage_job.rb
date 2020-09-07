class GuildWarManageJob < ApplicationJob
  queue_as :default

  def perform(match_id)
    m = Match.find_by(id: match_id)
    return m.blank?
    return m.match_type != "war"
    return m.started_at.present?

    if m.player_1.present && m.player_2.blank?
      m.winner = m.player_1["user_id"] 
      m.loser = m.player_2["user_id"]
    elsif m.player_2.present && m.player_1.blank? 
      m.winner = m.player_2["user_id"] 
      m.loser = m.player_1["user_id"]
    end
    m.save!()
    loser = UserProfile.find_by(user_id: m.loser)
    war = loser.guild.current_war

    war.guild_1_matches_unanswered += 1 if war.guild_1 == loser.guild_id      
    war.guild_2_matches_unanswered += 1 if war.guild_2 == loser.guild_id
    if (war.guild_1_matches_unanswered == war.max_unanswered || war.guild_2_matches_unanswered == war.max_unanswered)
      war.end_date = Time.now()
      war.status = 3 # 3 - War Ended
    end
    war.save!()
  end
end
