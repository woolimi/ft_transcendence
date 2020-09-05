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
		self.save()
		data = self.jbuild()
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "participant", data: data}
		update_ui(data)
		for i in 0...4 do
			ActionCable.server.broadcast("notification_channel_#{self.players[i]["user_id"]}", {
				type: 'tournament_start',
				content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "semifinal" }
			})
		end
		ForceMatchFinishIfNotStartedJob.set(wait_until: Time.now() + @@limit).perform_later(semiL)
		ForceMatchFinishIfNotStartedJob.set(wait_until: Time.now() + @@limit).perform_later(semiR)
	end

	def finish_semi()
		shouldStartFinal = semiR.match_finished && semiL.match_finished && final.blank?
		if (shouldStartFinal)
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
			self.save()
			update_ui(self.jbuild())
			ActionCable.server.broadcast("notification_channel_#{self.final.player_left[:id]}", {
				type: 'tournament_start',
				content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "final" }
			})
			ActionCable.server.broadcast("notification_channel_#{self.final.player_right[:id]}", {
				type: 'tournament_start',
				content: { tournament_id: self.id, tournament_name: self.name, tournament_type: "final" }
			})
			ForceMatchFinishIfNotStartedJob.set(wait_until: Time.now() + @@limit).perform_later(final)		
		else
			update_ui(self.jbuild())
		end
	end

	def finish_final()
		winner = final.winner
		status = 3
		self.save!()
		update_ui(self.jbuild())
	end

	def update_ui(data)
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "tree", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "info", data: data }
		ActionCable.server.broadcast "tournament_#{self.id}_channel", { type: "timer", data: data }
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



end
