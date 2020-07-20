class UserLoginsUserStatus < ApplicationRecord
  belongs_to :user_status
  belongs_to :user_login
end
