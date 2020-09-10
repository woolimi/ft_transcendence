class ApplicationController < ActionController::Base


  def new_session_path(scope)
    new_user_session_path
  end

  def debug(content)
		puts "\e[33m#{content}\e[0m"
  end
end
