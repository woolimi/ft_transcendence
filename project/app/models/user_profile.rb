class UserProfile < ApplicationRecord
	belongs_to :user
	belongs_to :guild, optional: true
	validates :nickname, uniqueness: true
end
