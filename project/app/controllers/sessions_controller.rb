class SessionsController < ApplicationController
	@@callback_uri = "http://localhost/callback"
	@@redirect_uri = CGI.escape(@@callback_uri)
	def create
		if user_signed_in?
			redirect_to root_path
		else
			redirect_to_42authorize
		end
	end

	def destroy
		reset_session
		redirect_to root_path
	end

	def callback
		# check state to avoid csrf
		check_state
		# get access token
		token = get_access_token
		# get user info
		@info = token.get('/v2/me').parsed
		# if current user not exist in db, create new user
		session[:uid] = @info["id"]
		if !User.find_by(uid: session[:uid])
			user = User.new
			user.uid = @info["id"]
			user.nickname = @info["login"] # wpark
			user.avatar_url = @info["image_url"] # "https://cdn.intra.42.fr/users/wpark.jpg"
			user.avatar_url[user.avatar_url.rindex('/')] = "/small_" # "https://cdn.intra.42.fr/users/small_wpark.jpg"
			user.save
			flash[:notice] = "user created"
		end
		flash[:alert] = "login success"
		redirect_to root_path
	end

	private 
	def redirect_to_42authorize
		state = SecureRandom.hex
		address = "https://api.intra.42.fr/oauth/authorize"
		args = [
			"client_id=" + ENV["FT_ID"],
			"redirect_uri=" + @@redirect_uri,
			"response_type=code",
			"state=" + state
		]
		cookies[:state] = state;
		redirect_to make_url(address, args)	
	end

	def make_url(address, args)
		res = address + "?"
		cnt = 0
		args.each{ |v|
			res += v
			cnt += 1
			if (args.count != cnt)
				res += "&"
			end
		}
		return res
	end

	def check_state
		is_same_state = (cookies[:state] == params[:state])
		cookies.delete :state
		if (!is_same_state || !params[:state])
			flash[:alert] = "Invalide access"
			redirect_to root_path
		end
	end

	def get_access_token
		client = OAuth2::Client.new(ENV["FT_ID"], ENV["FT_SECRET"],
			site: 'https://api.intra.42.fr')
		return token = client.auth_code.get_token(params[:code], :redirect_uri => @@callback_uri)
	end
end
