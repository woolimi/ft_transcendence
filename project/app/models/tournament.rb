class Tournament < ApplicationRecord
	belongs_to :semiL, class_name: "Match", optional: true, foreign_key: "semiL_id", dependent: :destroy
	belongs_to :semiR, class_name: "Match", optional: true, foreign_key: "semiR_id",  dependent: :destroy
	belongs_to :final, class_name: "Match", optional: true, foreign_key: "final_id",  dependent: :destroy

	validates :registration_start, presence: true
	validates :registration_end, presence: true
	validates :name, presence: true

	@@limit = 1.minutes

	def cancel
		self.destroy!
	end

	def launch
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
			match_type: 'tournament_semiR',
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
		self.status = 1
		self.limit = Time.now() + @@limit
		self.save()
		data = self.jbuild()
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "participant", data: data}
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "info", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "tree", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "timer", data: data }
		for i in 0...4 do
			ActionCable.server.broadcast("notification_channel_#{self.players[i]["user_id"]}", {
				type: 'tournament_start',
				content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "semifinal" }
			})
		end
		TournamentManagerJob.set(wait_until: self.limit).perform_later(self)
	end
	def manage
		return if self.status == 3
		return manage_final() if (self.final.present?)
		return if (self.limit > Time.now() && (!self.semiL.match_finished || !self.semiR.match_finished))
		manage_semiL() if (!self.semiL.match_finished)
		manage_semiR() if (!self.semiR.match_finished)
		final = Match.create(
			match_type: 'tournament_final',
			player_1: nil,
			player_2: nil,
			winner: nil,
			loser: nil,
			created_at: Time.now(),
			match_finished: false,
			player_left_id: self.semiL.winner,
			player_right_id: self.semiR.winner,
			tournament_id: self.id,
		)
		self.final_id = final.id
		self.status = 2 # final
		self.limit = Time.now() + @@limit
		self.save()
		data = self.jbuild()
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "tree", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "info", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "timer", data: data }
		ActionCable.server.broadcast("notification_channel_#{self.final.player_left[:id]}", {
			type: 'tournament_start',
			content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "final" }
		})
		ActionCable.server.broadcast("notification_channel_#{self.final.player_right[:id]}", {
			type: 'tournament_start',
			content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "final" }
		})
		TournamentManagerJob.set(wait_until: self.limit).perform_later(self)
	end
	def jbuild()
		return [] if self.nil?
		nplayers = []
		self.players.each{ |p|
			u = UserProfile.find_by(user_id: p).as_json(only: [:user_id, :avatar_url, :nickname]);
			nplayers.push(u)
		}
		self.players = nplayers
		res = self.as_json
		res.delete("semiL_id")
		res.delete("semiR_id")
		res.delete("final_id")
		
		res["semiL"] = self.semiL.as_json
		if (self.semiL.present? && self.semiL["winner"].present?)
			res["semiL"]["winner"] = UserProfile.find_by(user_id: self.semiL["winner"]).as_json(only: [:nickname, :avatar_url])
		end
		res["semiR"] = self.semiR.as_json
		if (self.semiR.present? && self.semiR["winner"].present?)
			res["semiR"]["winner"] = UserProfile.find_by(user_id: self.semiR["winner"]).as_json(only: [:nickname, :avatar_url])
		end
		res["final"] = self.final.as_json
		if (self.final.present? && self.final["winner"].present?)
			res["winner"] = UserProfile.find_by(user_id: self.final["winner"]).as_json(only: [:nickname, :avatar_url])
		end
		return res
	end

	private
	def manage_final
		if self.final.started_at.blank?
			# check if both player is in room or not in room
			self.final.match_finished = true
			self.final.started_at = Time.now()
			if ((self.final.player_1.present? && self.final.player_2.present?) || (self.final.player_1.blank? && self.final.player_2.blank?))
				win = rand(0..1)
			elsif (self.final.player_1.present? && self.final.player_2.blank?)
				win = 0
			elsif (self.final.player_1.blank? && self.final.player_2.present?)
				win = 1
			end
			self.final.winner = (win == 0 ? self.final.player_left_id : self.final.player_right_id)
			self.final.loser = (win == 0 ? self.final.player_right_id : self.final.player_left_id)
			self.final.score_left = (win == 0 ? 42 : 0)
			self.final.score_right = (win == 1 ? 42 : 0)
			self.winner = self.final.winner
			self.status = 3
			self.final.save!()
			self.save!()
			data = self.jbuild()
			ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "info", data: data }
			ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "tree", data: data }
			# add score to winner's guild	belongs_to :winner, class_name: "User", optional: true, foreign_key: "winner_id"

		end
	end

	def manage_semiL
		if self.semiL.started_at.blank?
			# check if both player is in room or not in room
			self.semiL.match_finished = true
			self.semiL.started_at = Time.now()
			if ((self.semiL.player_1.present? && self.semiL.player_2.present?) || (self.semiL.player_1.blank? && self.semiL.player_2.blank?))
				win = rand(0..1)
			elsif (self.semiL.player_1.present? && self.semiL.player_2.blank?)
				win = 0
			elsif (self.semiL.player_1.blank? && self.semiL.player_2.present?)
				win = 1
			end
			self.semiL.winner = (win == 0 ? self.semiL.player_left_id : self.semiL.player_right_id)
			self.semiL.loser = (win == 0 ? self.semiL.player_right_id : self.semiL.player_left_id)
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
			if ((self.semiR.player_1.present? && self.semiR.player_2.present?) || (self.semiR.player_1.blank? && self.semiR.player_2.blank?))
				win = rand(0..1)
			elsif (self.semiR.player_1.present? && self.semiR.player_2.blank?)
				win = 0
			elsif (self.semiR.player_1.blank? && self.semiR.player_2.present?)
				win = 1
			end
			self.semiR.winner = (win == 0 ? self.semiR.player_left_id : self.semiR.player_right_id)
			self.semiR.loser = (win == 0 ? self.semiR.player_right_id : self.semiR.player_left_id)
			self.semiR.score_left = (win == 0 ? 42 : 0)
			self.semiR.score_right = (win == 1 ? 42 : 0)
			self.semiR.save()
			# add score to winner's guild
		end
	end
end
