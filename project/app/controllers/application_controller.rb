class ApplicationController < ActionController::Base


  def new_session_path(scope)
    new_user_session_path
  end

  def debug(content)
		puts "\e[33m#{content}\e[0m"
  end

  # PLEASE DON'T REMOVE :)
  # def double_session?
  #   if !user_signed_in?
  #     return false
  #   end
  #   debug current_user.to_json
  #   check = User.where({ ft_id: current_user[:ft_id] })
  #     .select("users.id, user_profiles.status")
  #     .joins("INNER JOIN user_profiles ON users.id = user_profiles.user_id")[0]
  #   if check[:status] == 2
  #     return true
  #   else
  #     return false
  #   end
  # end

  # helper_method :double_session?
end
