class User < ApplicationRecord
#  devise :database_authenticatable, :registerable,
#         :recoverable, :rememberable, :trackable, :validatable,
#         :omniauthable, omniauth_providers: [:marvin]
  devise :omniauthable, omniauth_providers: [:marvin]

  def self.from_omniauth(auth)
    where(ft_id: auth.uid).first_or_create do |user|
      user.ft_id = auth.uid;
    end
  end
end