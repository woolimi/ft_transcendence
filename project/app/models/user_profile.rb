class UserProfile < ApplicationRecord
	belongs_to :user
	belongs_to :guild, optional: true
	validates :nickname, uniqueness: true

	def self.search(keyword, current_user)
		return UserProfile
			.where.not(user_id: current_user[:id])
			.where("lower(name) LIKE ? OR lower(nickname) LIKE ?", "%#{sanitize_sql_like(keyword)}%", "%#{sanitize_sql_like(keyword)}%")
			.as_json(only: [:user_id, :name, :nickname, :avatar_url])
	end
end
