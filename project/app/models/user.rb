# rails g devise user

class User < ApplicationRecord
#  devise :database_authenticatable, :registerable,
#         :recoverable, :rememberable, :trackable, :validatable,
#         :omniauthable, omniauth_providers: [:marvin]
  devise :omniauthable, omniauth_providers: [:marvin]
  has_one :user_profile
  def self.from_omniauth(auth, session_id)
    user = User.find_by(ft_id: auth[:uid])
    if user.blank?
      user = User.create(
        ft_id: auth[:uid], 
        session_id: session_id)        
      user.create_user_profile(
        name: auth[:info][:name],
        nickname: auth[:info][:nickname],
        avatar_url: auth[:info][:image])
    end
    return user
  end
end