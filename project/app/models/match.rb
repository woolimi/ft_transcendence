class Match < ApplicationRecord
	belongs_to :war, optional: true
	belongs_to :tournament, optional: true
	belongs_to :player_left, class_name: 'User', foreign_key: "player_left_id", optional: true
	belongs_to :player_right, class_name: 'User', foreign_key: "player_right_id", optional: true
	
	validates :match_type, presence: true

	def jbuild()
		res = self.as_json
		res["player_left"] = self.player_left.user_profile.as_json(only: [:user_id, :nickname, :avatar_url]) if self.player_left_id.present?
		res["player_right"] = self.player_right.user_profile.as_json(only: [:user_id, :nickname, :avatar_url]) if self.player_right_id.present?
		return res
	end

	def force_match_finish_if_not_started()
		if started_at.blank?
			self.match_finished = true
			self.started_at = Time.now()
			if ((self.player_1.present? && self.player_2.present?) || 
				(self.player_1.blank? && self.player_2.blank?))
				win = rand(0..1)
			elsif (self.player_1.present? && self.player_2.blank?)
				win = 0
			elsif (self.player_1.blank? && self.player_2.present?)
				win = 1
			end
			self.winner = (win == 0 ? self.player_left_id : self.player_right_id)
			self.loser = (win == 0 ? self.player_right_id : self.player_left_id)
			self.score_left = (win == 0 ? 42 : 0)
			self.score_right = (win == 1 ? 42 : 0)
			self.save()
			update_tournament_after_match_ends()
			# add score to winner's guild
		end
	end

	def update_tournament_after_match_ends
		if self.tournament.blank?
			return
		end
		if(self.match_type == 'tournament_semiL' || self.match_type == 'tournament_semiR')
			self.tournament.finish_semi()
		elsif(self.match_type == 'tournament_final')
			self.tournament.finish_final()
		end
	end

	# def populate_players_jsonb
	# 	if self.player_1.present?
	# 	end
	# 	if self.player_2.present?
	# 	end
	# 	info = current_user.user_profile
	# 	self.player_1 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id } if (current_user[:id] == m.player_left_id)
	# 	self.player_2 = {user_id: info.user_id, avatar_url: info.avatar_url, nickname: info.nickname, ready: false, guild_id: info.guild_id } if (current_user[:id] == m.player_right_id)  
	# end
end
