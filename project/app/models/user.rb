# rails g devise user

class User < ApplicationRecord
#  devise :database_authenticatable, :registerable,
#         :recoverable, :rememberable, :trackable, :validatable,
#         :omniauthable, omniauth_providers: [:marvin]
  devise :database_authenticatable,:registerable, :validatable, :omniauthable, omniauth_providers: [:marvin]
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
end