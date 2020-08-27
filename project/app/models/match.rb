class Match < ApplicationRecord
	belongs_to :war, optional: true
	belongs_to :tournament, optional: true
	has_one :player_left, class_name: 'User'
	has_one :player_right, class_name: 'User'
end
