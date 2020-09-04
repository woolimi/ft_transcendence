class War < ApplicationRecord
    has_many :matches
    validates :start_date, presence: true
    validates :end_date, presence: true
    validates :wager, presence: true
end
