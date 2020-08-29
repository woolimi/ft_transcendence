class Api::GuildsController < ApplicationController
  before_action :authenticate_user!

  def show
    allGuilds = Guild.select("id, name, anagram, total_score, owner, guild_officers").order("total_score DESC")
    # puts ">>>>>>>>>>>>>>>>>>>>>>here<<<<<<<<<<<<<<<<<<<<"
    # puts allGuilds.as_json
    return render json: allGuilds
  end
  
  def create
    anagram = params[:guildName]
    anagram = anagram.split('').shuffle.join
    guild = Guild.new(name: params[:guildName], anagram: anagram[0,5], total_score: 0, owner: current_user[:id], guild_officers: [current_user.user_profile])
    guild.save()
    me = UserProfile.find_by(user_id: current_user[:id])
    me.guild_id = guild.id
    me.save()
  end
end