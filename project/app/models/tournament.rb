class Tournament < ApplicationRecord
	belongs_to :semiL, class_name: "Match", optional: true, foreign_key: "semiL_id", dependent: :destroy
	belongs_to :semiR, class_name: "Match", optional: true, foreign_key: "semiR_id",  dependent: :destroy
	belongs_to :final, class_name: "Match", optional: true, foreign_key: "final_id",  dependent: :destroy

	validates :registration_start, presence: true
	validates :registration_end, presence: true
	validates :name, presence: true
	
	# def check_player_limit(arg)
	# 	raise "tournament full" if players.count >= 4
	# end

	# def semis_done?
	# 	matches.where(match_type: 'tournament_semi').where(match_finished: true).count == 2
	# end

	# def winner
	# 	matches.find_by(match_type: 'tournament_final').winner
	# end

	def cancel
		self.players.each do |p|
			u = User.find_by(id: p)
			u.send_notification('tournament_canceled', {
				name: self.name
			})
		end
		self.destroy!
	end

	def launch
		# self.started!
		semiL = Match.create(
			match_type: 'tournament_semiL',
			player_1: nil,
			player_2: nil,
			winner: nil,
			loser: nil,
			created_at: Time.now(),
			match_finished: false,
			player_left_id: self.players[0],
			player_right_id: self.players[1],
			tournament_id: self.id,
		)
		semiR = Match.create(
			match_type: 'tournament_semiL',
			player_1: nil,
			player_2: nil,
			winner: nil,
			loser: nil,
			created_at: Time.now(),
			match_finished: false,
			player_left_id: self.players[2],
			player_right_id: self.players[3],
			tournament_id: self.id,
		)
		self.semiL_id = semiL.id
		self.semiR_id = semiR.id
		self.save()

		TournamentManagerJob.set(wait_until: Time.now() + 5.minutes).perform_later(self)

		# players[0].send_notification('tournament_start', {
		# 	tournament_id: self.id,
		# 	tournament_name: self.name,
		# 	match_id: match1.id,
		# 	opponent_name: players[1].user_profile.name
		# })
		# players[1].send_notification('tournament_start', {
		# 	tournament_id: self.id,
		# 	tournament_name: self.name,
		# 	match_id: match1.id,
		# 	opponent_name: players[0].user_profile.name
		# })
		# players[2].send_notification('tournament_start', {
		# 	tournament_id: self.id,
		# 	tournament_name: self.name,
		# 	match_id: match2.id,
		# 	opponent_name: players[3].user_profile.name
		# })
		# players[3].send_notification('tournament_start', {
		# 	tournament_id: self.id,
		# 	tournament_name: self.name,
		# 	match_id: match2.id,
		# 	opponent_name: players[2].user_profile.name
		# })
	end

	def manage
		return if self.status == 2
		# check Final
		return manage_final() if (self.final.present?)
		# check Semifianl
		manage_semiL() if (!self.semiL.match_finished)
		manage_semiR() if (!self.semiR.match_finished)
		TournamentManagerJob.set(wait_until: Time.now() + 5.minutes).perform_later(self)

		# elsif (self.semiL.match_finished && self.semiR.match_finished)
		# 	final = Match.create(
		# 		match_type: 'tournament_final',
		# 		player_1: nil,
		# 		player_2: nil,
		# 		winner: nil,
		# 		loser: nil,
		# 		created_at: Time.now(),
		# 		match_finished: false,
		# 		player_left_id: self.semiL.winner,
		# 		player_right_id: self.semiR.winner,
		# 		tournament_id: self.id,
		# 	)
		# 	self.final_id = final.id
		# 	self.save()
		# 	return
		# end
	end

	private
	def manage_final
		if self.final.started_at.blank?
			# check if both player is in room or not in room
			self.final.match_finished = true
			self.final.started_at = Time.now()
			if ((self.final.player_1.present? && self.final.player_2.present?)
				|| (self.final.player_1.blank? && self.final.player_2.blank?))
				win = rand(0..1)
			elsif (self.final.player_1.present? && self.final.player_2.blank?)
				win = 0
			elsif (self.final.player_1.blank? && self.final.player_2.present?)
				win = 1
			end
			self.winner = (win == 0 ? self.final.player_left_id : self.final.player_right_id)
			self.final.score_left = (win == 0 ? 42 : 0)
			self.final.score_right = (win == 1 ? 42 : 0)
			self.final.save()
			# add score to winner's guild
		end
	end

	def manage_semiL
		if self.semiL.started_at.blank?
			# check if both player is in room or not in room
			self.semiL.match_finished = true
			self.semiL.started_at = Time.now()
			if ((self.semiL.player_1.present? && self.semiL.player_2.present?)
				|| (self.semiL.player_1.blank? && self.semiL.player_2.blank?))
				win = rand(0..1)
			elsif (self.semiL.player_1.present? && self.semiL.player_2.blank?)
				win = 0
			elsif (self.semiL.player_1.blank? && self.semiL.player_2.present?)
				win = 1
			end
			self.winner = (win == 0 ? self.semiL.player_left_id : self.semiL.player_right_id)
			self.semiL.score_left = (win == 0 ? 42 : 0)
			self.semiL.score_right = (win == 1 ? 42 : 0)
			self.semiL.save()
			# add score to winner's guild
		end
	end
	def manage_semiR
		if self.semiR.started_at.blank?
			# check if both player is in room or not in room
			self.semiR.match_finished = true
			self.semiR.started_at = Time.now()
			if ((self.semiR.player_1.present? && self.semiR.player_2.present?)
				|| (self.semiR.player_1.blank? && self.semiR.player_2.blank?))
				win = rand(0..1)
			elsif (self.semiR.player_1.present? && self.semiR.player_2.blank?)
				win = 0
			elsif (self.semiR.player_1.blank? && self.semiR.player_2.present?)
				win = 1
			end
			self.winner = (win == 0 ? self.semiR.player_left_id : self.semiR.player_right_id)
			self.semiR.score_left = (win == 0 ? 42 : 0)
			self.semiR.score_right = (win == 1 ? 42 : 0)
			self.semiR.save()
			# add score to winner's guild
		end
	end
end
