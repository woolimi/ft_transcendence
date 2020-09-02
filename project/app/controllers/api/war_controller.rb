class Api::WarController < ApplicationController
    before_action :authenticate_user!

    def show
        if (params[:user_id] == current_user[:id])
            user = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:guild_id])
            if (!user["guild_id"])
                response = "{'status':'user does not have any guild'}"
                return render json: response, status: :ok
            end
            # war = War.find_by(guild_1: user["guild_id"]).as_json()
            war = War.where('(guild_1 = ? OR guild_2 = ?) AND status = 2', user["guild_id"], user["guild_id"]).as_json
            
            if (war.length == 0)
                war = War.where('(guild_1 = ? OR guild_2 = ?) AND start_date > ? AND status = 1', user["guild_id"], user["guild_id"], Time.zone.now.to_datetime).order(start_date: :asc).as_json()
                if (war.length == 0)
                    return render json: "{}", status: :ok
                end
            end
            puts ">>>>>>>>>>>>>>>>."
            puts Time.zone.now.to_datetime
            puts war
            puts "================."
            puts war[0]
            puts ">>>>>>>>>>>>>>>>."
            guild_info = check_guild_number(war, user["guild_id"]).split(':')
            guilds = Guild.where(id: war[0]["guild_1"]).or(Guild.where(id: war[0]["guild_2"])).as_json
            
            if (guilds[0]["id"] == war[0][(guild_info[0])])
                war[0]["player_guild_anag"] = guilds[0]["anagram"]
                war[0]["opponent_guild_anag"] = guilds[1]["anagram"]
            elsif (guilds[1]["id"] == war[0][(guild_info[0])])
                war[0]["player_guild_anag"] = guilds[1]["anagram"]
                war[0]["opponent_guild_anag"] = guilds[0]["anagram"]
            end

            if ((war[0][(guild_info[0].to_s + "_score")]).to_i > (war[0][(guild_info[1].to_s  + "_score")].to_i))
                war[0]["position"] = "win";
            elsif ((war[0][(guild_info[0].to_s + "_score")]).to_i == (war[0][(guild_info[1].to_s  + "_score")].to_i))
                war[0]["position"] = "draw";
            else
                war[0]["position"] = "loss";
            end
            war[0]["wins"] = war[0][guild_info[0] + "_matches_won"]
            war[0]["losses"] = war[0][guild_info[0] + "_matches_lost"]
            war[0]["unanswered"] = war[0][guild_info[0] + "_matches_unanswered"]
            return render json: war[0], status: :ok
        else
			return render plain: "Forbidden", status: :forbidden 
        end
    end

    def update
        war = War.find_by(id: params["id"])
        if (war.match_ongoing == true)
            return render json: "ONGOING!", status: :forbidden
        else
            war[0][:match_ongoing] = true;
            war.save();
            return render json: "SUCCESS!", status: :ok
        end
    end

    private

    def check_guild_number(war, user_guild_id)
        puts ">>>>>>>>>>>>>>>>>>>>>>>>"
        puts war[0]["guild_1"]
        puts war[0]["guild_1"].class
        puts user_guild_id
        puts user_guild_id.class
        puts ">>>>>>>>>>>>>>>>>>>>>>>>"
        if (war[0]["guild_1"] == user_guild_id)
            return ("guild_1:guild_2");
        elsif (war[0]["guild_2"] == user_guild_id)
            return ("guild_2:guild_1");
        else
            return ("undefined");
        end
        puts "INSIDE THIS METHODDDDDDDDDDDDDDD"
    end
end