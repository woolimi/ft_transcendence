class Api::TwoFactorsController < ApplicationController
	protect_from_forgery
	before_action :authenticate_user!

    def show
        return render plain: "Forbidden", status: :forbidden if params[:user_id] != current_user[:id]
        user = User.find_by(id: current_user[:id]).as_json(only: [:id, :otp_backup_codes, :otp_required_for_login])
        return render plain: "Forbidden", status: :forbidden if user.blank?
        data = {
            :user_id => user["id"],
            :otp_backup_codes => user["otp_backup_codes"],
            :otp_required_for_login => user["otp_required_for_login"],
        }
        if user["otp_required_for_login"]
            data[:otp_qr_code] = current_user.otp_qr_code.html_safe
        end
        return render json: data, status: :ok
    end
    
    # POST /api/two_factors
    def create
        ret = (current_user.validate_and_consume_otp!(params["otp_attempt"]) || check_backup_code(params[:otp_attempt]))
        user_session["otp_validated"] = ret
        return render plain: "forbidden", status: :forbidden if !ret
        return render plain: "ok", status: :ok
    end

    # PUT /api/two_factors/
    def update
        if (params[:user_id] == current_user[:id])
            if (params[:otp_required_for_login] == "true")
                enable()
            else
                disable()
            end
        end
    end

    private

    def enable_2fa_params
        params.require(:two_fa).permit(:code, :password)
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

    def check_backup_code(code)
        ret = current_user.otp_backup_codes.include?(code)
        if (ret == true)
            current_user.otp_backup_codes.delete(code)
            current_user.update(otp_backup_codes: current_user.otp_backup_codes)
            return true
        end
        return false
    end
end