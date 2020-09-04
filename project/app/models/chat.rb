class Chat < ApplicationRecord
	has_many :chat_messages, dependent: :destroy
	validates :room, presence: true
end
