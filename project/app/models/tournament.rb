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
		self.status = 1
		self.save()
		
		ActionCable.server.broadcast("notification_channel_#{players[0]}", {
			type: 'tournament_start',
			content: {
				tournament_id: self.id,
				tournament_name: self.name,
				match_id: semiL.id
			}
		})
		ActionCable.server.broadcast("notification_channel_#{players[1]}", {
			type: 'tournament_start',
			content: {
				tournament_id: self.id,
				tournament_name: self.name,
				match_id: semiL.id
			}
		})
		ActionCable.server.broadcast("notification_channel_#{players[2]}", {
			type: 'tournament_start',
			content: {
				tournament_id: self.id,
				tournament_name: self.name,
				match_id: semiR.id
			}
		})
		ActionCable.server.broadcast("notification_channel_#{players[3]}", {
			type: 'tournament_start',
			content: {
				tournament_id: self.id,
				tournament_name: self.name,
				match_id: semiR.id
			}
		})
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
		res["semiR"] = self.semiR.as_json
		res["final"] = self.final.as_json
		res["final"]["player_left"] = self.final.player_left.as_json if self.final.present?
		res["final"]["player_right"] = self.final.player_right.as_json if self.final.present?
		return res
	end

end
