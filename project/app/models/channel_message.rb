class ChannelMessage < ApplicationRecord
	belongs_to :channel
	belongs_to :user
	validates :content, presence: true
end
