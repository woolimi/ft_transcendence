class TwoFactorsController < ApplicationController
    before_action :authenticate_user!

    def create
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