class UserLogin < ApplicationRecord
    has_one:user_profile
    has_one:user_stat
    has_one:user_status
end
