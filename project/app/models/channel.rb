class Channel < ApplicationRecord
	has_many :channel_messages, dependent: :destroy
	validates :room, presence: true
	validates :channel_type, presence: true
end
