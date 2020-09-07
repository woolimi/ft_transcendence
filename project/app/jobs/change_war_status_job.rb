class ChangeWarStatusJob < ApplicationJob
  queue_as :default

  def perform(war)
    if (war)
      # war = War.find_by(id: war.id)
      war.status = war.status + 1
      war.save()
      if(war.status == 3)
        guild_1 = Guild.find_by(id: war.guild_1)
        guild_2 = Guild.find_by(id: war.guild_2)
        if(war.guild_1_score.to_i > war.guild_2_score.to_i)
          guild_1.total_score = (guild_1.total_score.to_i + (2 * war.wager))
        elsif(war.guild_1_score.to_i < war.guild_2_score.to_i)
          guild_2.total_score = (guild_2.total_score.to_i + (2 * war.wager))
        else
          guild_1.total_score = (guild_1.total_score.to_i + war.wager)
          guild_2.total_score = (guild_2.total_score.to_i + war.wager)
        end
        guild_1.save()
        guild_2.save()
      end
    end
    # Do something later
  end
end
