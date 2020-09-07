class War < ApplicationRecord
    has_many :matches
    validates :start_date, presence: true
    validates :end_date, presence: true
    validates :wager, presence: true

    def calculate_WP(winner_guild_id, match_type)
        points = 0
        # if it is war match, get 50 points
        if match_type == "war"
            points = 50 
        # if it is not war match, get 25 points depends on options
         else
            # war_type : Tournament, duel, ladder
            points = 25 if (war_type[0] == "1" && match_type == "tournament_final")
            points = 25 if (war_type[1] == "1" && match_type.include?("duel"))
            points = 25 if (war_type[2] == "1" && match_type == "ladder")     
        end
        if self.guild_1 == winner_guild_id
            self.guild_1_score += points
        elsif self.guild_2 == winner_guild_id
            self.guild_2_score += points
        end
        self.save() if points != 0
    end
end
