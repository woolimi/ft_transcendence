# rails g devise user

class User < ApplicationRecord
  devise :two_factor_authenticatable, :two_factor_backupable,:otp_secret_encryption_key => ENV['OTP_KEY']

#  devise :registerable,
#         :recoverable, :rememberable, :trackable, :validatable,
#         :omniauthable, omniauth_providers: [:marvin]
  devise :registerable, :validatable, :omniauthable, omniauth_providers: [:marvin]
  has_one :user_profile
  has_many :chat_messages
  def self.from_omniauth(auth, session_id)
    user = User.find_by(ft_id: auth[:uid])
    if user.blank?
      small_img = auth[:info][:image];
      small_img[small_img.rindex("/")] = "/small_"
      user = User.create(
        ft_id: auth[:uid], 
        session_id: session_id,
        email: auth[:info][:email],
        password: "asdfas")
      user.create_user_profile(
        name: auth[:info][:name],
        nickname: auth[:info][:nickname],
        avatar_url: small_img)
    end
    return user
  end
  def self.check_already_logged_in(user)
      status = UserProfile.find_by(user_id: user.id).status;
      if (status != 0)
        return true   
      end
        return false
  end

  def otp_qr_code
    issuer = '42 Pong'
    label = "#{issuer}:#{email}"
    qrcode = RQRCode::QRCode.new(otp_provisioning_uri(label, issuer: issuer))
    qrcode.as_svg(module_size: 4)
  end

end