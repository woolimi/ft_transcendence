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
		raise "tournament full" if players.count >= 4
	end

	def semis_done?
		matches.where(match_type: 'tournament_semi').where(match_finished: true).count == 2
	end

	def winner
		matches.find_by(match_type: 'tournament_final').winner
	end

	def cancel
		self.players.each do |player|
			player.send_notification('tournament_canceled',{
				name: self.name
			})
		end
		self.destroy!
	end

	def launch
		self.started!
		match1=Match.create(
			match_type: 'tournament_semi',
			tournament: self,
			player_left: players[0],
			player_right: players[1],
			player_1: {score: 0},
			player_2: {score: 0},
			winner: 0,
			loser: 0,
			match_finished: false
		)
		match2=Match.create(
			match_type: 'tournament_semi',
			tournament: self,
			player_left: players[2],
			player_right: players[3],
			player_1: {score: 0},
			player_2: {score: 0},
			winner: 0,
			loser: 0,
			match_finished: false
		)
		players[0].send_notification('tournament_start', {
			tournament_id: self.id,
			tournament_name: self.name,
			match_id: match1.id,
			opponent_name: players[1].user_profile.name
		})
		players[1].send_notification('tournament_start', {
			tournament_id: self.id,
			tournament_name: self.name,
			match_id: match1.id,
			opponent_name: players[0].user_profile.name
		})
		players[2].send_notification('tournament_start', {
			tournament_id: self.id,
			tournament_name: self.name,
			match_id: match2.id,
			opponent_name: players[3].user_profile.name
		})
		players[3].send_notification('tournament_start', {
			tournament_id: self.id,
			tournament_name: self.name,
			match_id: match2.id,
			opponent_name: players[2].user_profile.name
		})
	end

end
