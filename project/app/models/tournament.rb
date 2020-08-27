class Tournament < ApplicationRecord
	has_many :tournament_users, dependent: :destroy, before_add: :check_player_limit
	has_many :players, through: :tournament_users, source: :user

	has_many :matches, dependent: :destroy

	enum status: [
		:pending,
		:started,
		:finished
	]

	validates :registration_start, presence: true
	validates :registration_end, presence: true
	validates :name, presence: true
	
	def check_player_limit(arg)
		raise "tournament full" if players.count >= 8
	end

	def semis_done?
		matches.where(match_type: 'tournament_semi').where.not(winner: '').count == 2
	end

	def winner
		matches.find_by(match_type: 'tournament_final').winner
	end


end
