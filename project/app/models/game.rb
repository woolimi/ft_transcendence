class Game < ApplicationRecord
	has_many :game_users, dependent: :destroy
	has_many :users, through: :game_users, source: :user

	belongs_to :tournament, optional: true

	validates :game_type, presence: true

	enum game_type: [
		:ladder,
		:simple,
		:tournament_quarter,
		:tournament_semi,
		:tournament_final,
		:war_time
	]

	enum status: [
		:pending,
		:started,
		:finished
	]

	def winner
		finished? && game_users.win.first.user
	end

end
