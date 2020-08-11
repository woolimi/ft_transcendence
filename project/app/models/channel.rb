class Channel < ApplicationRecord
	has_many :channel_messages, dependent: :destroy
end
