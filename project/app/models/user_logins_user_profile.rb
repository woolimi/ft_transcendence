class UserLoginsUserProfile < ApplicationRecord
  belongs_to :user_profile
  belongs_to :user_login
end
