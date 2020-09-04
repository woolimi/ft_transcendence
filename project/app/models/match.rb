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
end
