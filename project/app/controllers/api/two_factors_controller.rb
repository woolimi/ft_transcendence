class Api::TwoFactorsController < ApplicationController
    before_action :authenticate_user!

    def show
        puts params[:user_id]
        if (params[:user_id] == current_user[:id])
            user = User.find_by(id: current_user[:id]).as_json(only: [:user_id, :otp_backup_codes, :otp_required_for_login])
            render json: user
        else
            render json: {}
        end
    end

    def enable
        current_user.update(
            otp_secret: User.generate_otp_secret,
            otp_required_for_login: true,
            otp_backup_codes: current_user.generate_otp_backup_codes!
        )
    end

    def disable
        current_user.update(
            otp_required_for_login: false
        )
    end

    # PUT /api/two_factors/
    def update
        if (params[:user_id] == current_user[:id])
            if (params[:otp_required_for_login] == true)
                enable()
            else
                disable()
            end        
        end
    end
end