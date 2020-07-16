class User < ApplicationRecord
	validates :uid, presence: true
	validates :nickname, presence: true
	validates :avatar_url, presence: true
end
