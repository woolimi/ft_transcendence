class SpaController < ApplicationController
  def index
    @user = current_user
    if !@user
      @user = "null"
    end
  end
end
