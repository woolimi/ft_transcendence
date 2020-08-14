class TwoFactorsController < ApplicationController
    before_action :authenticate_user!

    def show
        puts '...........................................................inside get'
        if (params[:user_id] == current_user[:id])
            user = User.find_by(user_id: current_user[:id]).as_json(only: [:user_id, :otp_backup_codes, :otp_required_for_login])
            render json: user
        else
            render json: {}
        end
    end

    def create
        puts 'I am here bro!'
        current_user.update(
            otp_secret: User.generate_otp_secret,
            otp_required_for_login: true
            )
        @codes = current_user.generate_otp_backup_codes!
    end

    def destroy
        current_user.update(
            otp_required_for_login: false
        )
    end
end