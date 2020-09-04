class UserProfile < ApplicationRecord
	belongs_to :user
	validates :nickname, uniqueness: true
	validates :name, presence: true, uniqueness: true

	def self.search(query)
		where.not(user_id: current_user[:id])
		.where("lower(name) LIKE ? OR lower(nickname) LIKE ?", "%#{sanitize_sql_like(query)}%", "%#{sanitize_sql_like(query)}%")
		.as_json(only: [:user_id, :name, :nickname, :avatar_url])
	end
end
