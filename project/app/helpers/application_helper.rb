module ApplicationHelper
	def current_user
		return User.find_by(uid: session[:uid])
	end

	# if logged in, return true. Otherwise return false
	def user_signed_in?
		!current_user.nil?
	end
end
