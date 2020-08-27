class Api::WarController < ApplicationController
    before_action :authenticate_user!

    def show
        if (params[:user_id] == current_user[:id])
            user = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:guild_id])

            puts ">>>>>>>>>>>>>>>>>>>>>>>"
            puts user
            puts ">>>>>>>>>>>>>>>>>>>>>>>"
            guild = Guild.find_by(id: user["guild_id"]).as_json(only: [:war_id])
            
            
            war = War.find_by(id: guild["war_id"]).as_json(only: [:guild_1, :guild_2, :guild_1_score, :guild_2_score, :start_date, :end_date, :match_ongoing, :])
            

            user_guild_number = check_guild_number(war, user["guild_id"])
            if ((war[user_guild_number + "_score"] === war["guild_1_score"]) && (war["guild_1_score"] > war["guild_2_score"]))
                war["position"] = "win"
            elsif ((war[user_guild_number + "_score"] === war["guild_2_score"]) && (war["guild_2_score"] > war["guild_1_score"]))
                war["position"] = "win"
            elsif ((war[user_guild_number + "_score"] === war["guild_2_score"]) && (war["guild_2_score"] < war["guild_1_score"]))
                war["position"] = "loss"
            elsif ((war[user_guild_number + "_score"] === war["guild_1_score"]) && (war["guild_1_score"] < war["guild_1_score"]))
                war["position"] = "loss"
            else
                war["position"] = "draw"
            end
            war["user_guild_name"] = war[user_guild_number+"_name"]
            return render json: war, status: :ok
        else
			return render plain: "Forbidden", status: :forbidden 
        end
    end

    private

    def check_guild_number(war, user_guild_id)
        if (war["guild_1"] == user_guild_id)
            return ("guild_1");
        elsif (war["guild_2"] == user_guild_id)
            return ("guild_2");
        else
            return ("undefined");
        end
    end
end