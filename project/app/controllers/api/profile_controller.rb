require 'json'

class Api::ProfileController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

	# GET api/profile/:user_id
	def show
		if (params[:user_id] == current_user[:id])
			profile = UserProfile.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :name, :nickname, :avatar_url, :two_factor, :photo, :guild_id, :admin])
			block_id_list = UserProfile.find_by(user_id: current_user[:id])[:block_list];
			res = []
			block_id_list.each do |id|
				res.push(UserProfile.find_by(user_id: id).as_json(only: [:user_id, :nickname, :name]))
			end
			profile[:block_list] = res
			render json: profile			
		else
			render json: {}
		end
	end

	# PATCH / PUT
	def update
		me = UserProfile.find_by(user_id: current_user[:id])
		# puts me.photo.as_json()
		if ((params[:nickname] <=> me.nickname) != 0)
			user = UserProfile.find_by(:nickname => params[:nickname])
			if (user.present?)
				render plain: "nickname already exists, please use a unique nickname#" + me.nickname, status: :ok
			end
			me.nickname = params[:nickname]
		end
		if (params[:guild_id] != me.guild_id)
			if(params[:guild_id].nil? == false)
				guild = Guild.find_by(:id => params[:guild_id])
				if(guild[:guild_members] != nil)
					guild[:guild_members] = guild[:guild_members].push(current_user.user_profile)
				else
					guild[:guild_members] = [current_user.user_profile]
				end
				guild.save()
			else
				guild = Guild.find_by(:id => me.guild_id)
				puts guild[:id]
				puts me.guild_id
				if(guild[:guild_members].as_json.length == 1)
					guild[:guild_members] = "{}"
					guild[:guild_officers] = "{}"
					guild[:owner] = ""
				elsif (guild[:owner] == me.user_id && guild[:guild_officers].as_json.length == 1)
					guild[:owner] = guild[:guild_members][1].values[3]
					guild[:guild_officers] = guild[:guild_officers].push(guild[:guild_members][1])
					#//remove from members list
					mem_list = []
					for i in guild[:guild_members]
						if i.values[3] != me.user_id
							mem_list.push(i)
						end
					end
					guild[:guild_members] = mem_list
					#remove from officer's list
					off_list = []
					for i in guild[:guild_officers]
						if i.values[3] != me.user_id
							off_list.push(i)
						end
					end
					guild[:guild_officers] = off_list
				elsif (guild[:owner] == me.user_id && guild[:guild_officers].as_json.length > 1)
					guild[:owner] = guild[:guild_members][1].values[3]
					#//remove from members list
					mem_list = []
					for i in guild[:guild_members]
						if i.values[3] != me.user_id
							mem_list.push(i)
						end
					end
					guild[:guild_members] = mem_list
					#remove from officer's list
					off_list = []
					for i in guild[:guild_officers]
						if i.values[3] != me.user_id
							off_list.push(i)
						end
					end
					guild[:guild_officers] = off_list
				else
					#//remove from members list
					mem_list = []
					for i in guild[:guild_members]
						if i.values[3] != me.user_id
							mem_list.push(i)
						end
					end
					guild[:guild_members] = mem_list

					#remove from officer's list
					off_list = []
					for i in guild[:guild_officers]
						if i.values[3] != me.user_id
							off_list.push(i)
						end
					end
					guild[:guild_officers] = off_list
				end
				guild.save()
			end
			me.guild_id = params[:guild_id]
		end
		arr =  params[:block_list].as_json();
		res = []
		arr.each do |blocked_users|
			res.push(blocked_users["user_id"])
		end

		if (res <=> me.block_list)
			me.block_list = res
		end
		if (params[:two_factor] <=> me.two_factor)
			me.two_factor = params[:two_factor]
		end
		if (params[:photo] <=> "")
			result = Cloudinary::Uploader.upload(params[:photo])
			me.avatar_url = result["url"]
		end		
		me.save()
		# validates = me.save()
		# puts validates
		# if (validates == true)
		# 	puts "true"
		# 	render plain: "", status: :ok
		# else
		# 	render json: nil, status: :internal_server_error
		# end
	end
end
