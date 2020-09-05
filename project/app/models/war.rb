class War < ApplicationRecord
    has_many :matches
    validates :start_date, presence: true
    validates :end_date, presence: true
    validates :wager, presence: true

    def add_score(guild_id, match_type)
        points = nil
        # if it is war match, get 50 points
        if match_type == "war"
            points = 50 
        # if it is not war match, get 25 points depends on options
        else
            
        end

        if self.guild_1 == guild_id
            self.guild_1_score += points
        elsif self.guild_2 == guild_id
            self.guild_2_score += points
        end
        self.save()
    end
end
