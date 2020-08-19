class UserProfile < ApplicationRecord
	belongs_to :user
	validates :nickname, uniqueness: true
end
