class Api::WarRequestController < ApplicationController
    before_action :authenticate_user!

    def show
		guild = UserProfile.find_by(user_id: current_user[:id])[:guild_id];
        
        war = War.where(guild_1:guild).or(War.where(guild_2:guild))
        wars_final = []
        for i in war
            if( i[:status] < 2)
                wars_final = wars_final.push(i)
            end
        end
        return render json: wars_final
    end

    def create
        arr =  params[:data].split(",")
        guild_1 = Guild.find_by(name: arr[0])[:id]
        guild_2 = Guild.find_by(name: arr[1])[:id]
        war = War.create(guild_1: guild_1, guild_2: guild_2, guild_1_score: 0, guild_2_score: 0,guild_1_matches_won: 0, guild_2_matches_won: 0, guild_1_matches_lost: 0, guild_2_matches_lost: 0, guild_1_matches_unanswered: 0, guild_2_matches_unanswered: 0, wager: arr[2], max_unanswered: arr[3], status: 0, start_date: arr[4], end_date: arr[5], war_type: arr[6])
        war.save()
    end
    
    def update
        current_war = War.find_by(id: params[:war_id])
        war_start = current_war[:start_date]
        war_end = current_war[:end_date]
        guild_1 = Guild.find_by(id: current_war[:guild_1])
        guild_2 = Guild.find_by(id: current_war[:guild_2])
        if((guild_1[:total_score].to_i < current_war[:wager].to_i) || (guild_2[:total_score].to_i < current_war[:wager].to_i))
            current_war.delete()
            current_war.save()
            return render json: "Both Guilds Should have points more than wager!", status: :bad_request
        end

        existing_wars = War.where('(guild_1 = ? OR guild_1 = ? OR guild_2 = ? OR guild_2 = ?) AND (status = 1 OR status = 2)', guild_1[:id], guild_2[:id], guild_1[:id], guild_2[:id])
        for i in existing_wars
            if((war_start <= i.end_date) and (war_end >= i.start_date))
                current_war.delete()
                current_war.save()
                return render json: "One or both guilds are not available in this time period", status: :bad_request
            end
        end
        guild_1[:total_score] = guild_1[:total_score] - current_war[:wager]
        guild_2[:total_score] = guild_2[:total_score] - current_war[:wager]
        current_war[:status] = 1

        guild_1.save()
        guild_2.save()
        current_war.save()
        ChangeWarStatusJob.set(wait_until: current_war.start_date).perform_later(current_war)
        ChangeWarStatusJob.set(wait_until: current_war.end_date).perform_later(current_war)
    end

    def destroy
        war = War.find_by(id: params[:war_id])
        war.delete()
        war.save()
    end
end