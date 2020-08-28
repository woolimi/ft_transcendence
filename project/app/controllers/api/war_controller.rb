class Api::WarController < ApplicationController
    before_action :authenticate_user!

    def show
        if (params[:user_id] == current_user[:id])
            user = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:guild_id])
            if (!user["guild_id"])
                response = "{'status':'user does not have any guild'}"
                return render json: response, status: :ok
            end
            war = War.find_by(guild_1: user["guild_id"]).as_json()
            if (!war)
                war = War.find_by(guild_2: user["guild_id"]).as_json()
                if (!war)
                    return render json: "{}", status: :ok
                end
            end
            guild_info = check_guild_number(war, user["guild_id"]).split(':')
            guilds = Guild.where(id: war["guild_1"]).or(Guild.where(id: war["guild_2"])).as_json
            
            if (guilds[0]["id"] == war[(guild_info[0])])
                war["player_guild_anag"] = guilds[0]["anagram"]
                war["opponent_guild_anag"] = guilds[1]["anagram"]
            elsif (guilds[1]["id"] == war[(guild_info[0])])
                war["player_guild_anag"] = guilds[1]["anagram"]
                war["opponent_guild_anag"] = guilds[0]["anagram"]
            end

            if ((war[(guild_info[0] + "_score")]).to_i > (war[(guild_info[1]  + "_score")].to_i))
                war["position"] = "win";
            elsif ((war[(guild_info[0] + "_score")]).to_i == (war[(guild_info[1]  + "_score")].to_i))
                war["position"] = "draw";
            else
                war["position"] = "loss";
            end
            war["wins"] = war[guild_info[0] + "_matches_won"]
            war["losses"] = war[guild_info[0] + "_matches_lost"]
            war["unanswered"] = war[guild_info[0] + "_matches_unanswered"]
            return render json: war, status: :ok
        else
			return render plain: "Forbidden", status: :forbidden 
        end
    end

    def update
        war = War.find_by(id: params["id"])
        if (war.match_ongoing == true)
            return render json: "ONGOING!", status: :forbidden
        else
            war[:match_ongoing] = true;
            war.save();
            return render json: "SUCCESS!", status: :ok
        end
    end

    private

    def check_guild_number(war, user_guild_id)
        if (war["guild_1"] == user_guild_id)
            return ("guild_1:guild_2");
        elsif (war["guild_2"] == user_guild_id)
            return ("guild_2:guild_1");
        else
            return ("undefined");
        end
    end
end