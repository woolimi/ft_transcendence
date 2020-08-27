class Match < ApplicationRecord
	belongs_to :war, optional: true
	belongs_to :tournament, optional: true
	belongs_to :player_left, class_name: 'User', foreign_key: "player_left_id"
	belongs_to :player_right, class_name: 'User', foreign_key: "player_right_id"
end
