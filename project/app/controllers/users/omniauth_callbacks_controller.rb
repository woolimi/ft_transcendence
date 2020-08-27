# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # You should also create an action method in this controller like this:
  def marvin
    # @user = User.find_for_oauth(request.env["omniauth.auth"], current_user)
      @user = User.from_omniauth(request.env["omniauth.auth"])
      if @user.persisted?
        sign_in_and_redirect @user, :event => :authentication
        set_flash_message(:notice, :success, :kind => "42") if is_navigational_format?
      else
        session["devise.marvin_data"] = request.env["omniauth.auth"].except(:extra) 
        redirect_to new_user_registration_url
      end
  end


  # More info at:
  # https://github.com/heartcombo/devise#omniauth

  # GET|POST /resource/auth/marvin
  def passthru
    super
  end

  # GET|POST /users/auth/marvin/callback
  def failure
    flash[:alert] = "Failed to Sign in 42"
    redirect_to root_path
  end

  protected

  # The path used when OmniAuth fails
  def after_omniauth_failure_path_for(scope)
    super(scope)
  end
end