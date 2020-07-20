class UserLoginsUserStat < ApplicationRecord
  belongs_to :user_stat
  belongs_to :user_login
end
