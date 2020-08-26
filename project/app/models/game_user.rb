class GameUser < ApplicationRecord
	belongs_to :user
	belongs_to :game

	enum status: [
		:pending,
		:ready,
		:ingame,
		:win,
		:loose
	]

	enum position: [
		:left,
		:right
	]

	validates :game_id, uniqueness: {scope: [:position]}
	validates :user_id, uniqueness: {scope: [:game_id]}
	validates :position, presence: true
end
