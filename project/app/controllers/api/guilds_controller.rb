class Api::GuildsController < ApplicationController
  before_action :authenticate_user!

  def show
    allGuilds = Guild.select("id, name, anagram, total_score, owner, guild_officers, guild_members").order("total_score DESC")
    return render json: allGuilds
  end
  
  def create
    anagram = params[:guildName]
    anagram = anagram.split('').shuffle.join
    guild = Guild.new(name: params[:guildName], anagram: anagram[0,5], total_score: 1000, owner: current_user[:id], guild_officers: [current_user.user_profile], guild_members: [current_user.user_profile])
    guild.save()
    me = UserProfile.find_by(user_id: current_user[:id])
    me.guild_id = guild.id
    me.save()
  end

  # Helper.ajax('/api/guilds' , {toggle_guild: ..., toggle_id: ...}, 'PUT')
  def update
    guild = Guild.find_by(id: params[:toggle_guild])
    off_list = []
    flag = 0
		for i in guild[:guild_officers]
			if i["user_id"] != params[:toggle_id]
        off_list.push(i)
      else
        flag = 1
			end
    end
    if (flag == 0)
      user = UserProfile.find_by(user_id: params[:toggle_id])
      off_list.push(user)
    end
		guild[:guild_officers] = off_list
    guild.save()
  end

  def destroy
    guild = Guild.find_by(id: params[:guild_id])
    off_list = []
		for i in guild[:guild_officers]
			if i["user_id"] != params[:delete_id]
        off_list.push(i)
			end
    end

    mem_list = []
    for i in guild[:guild_members]
			if i["user_id"] != params[:delete_id]
        mem_list.push(i)
			end
    end
    guild[:guild_members] = mem_list
    user = UserProfile.find_by(user_id: params[:delete_id])
    user[:guild_id] = ""
    user.save()
    guild.save()
  end
end
