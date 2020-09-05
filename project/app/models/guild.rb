class Guild < ApplicationRecord
	validates :name, presence: true, uniqueness: true
	validates :anagram, presence: true, uniqueness: true
end
