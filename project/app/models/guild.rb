class Guild < ApplicationRecord
	validates :name, presence: true, uniqueness: true
	validates :anagram, presence: true, uniqueness: true

# 0 - Request Arrived
# 1 - Request accepted
# 2 - War Started
# 3 - War Ended
	def in_war?
		res = War.where(status: 2).where("guild_1 = ? OR guild_2 = ?", self.id, self.id)
		return false if res.empty?
		return true
	end

	def current_war
		res = War.where(status: 2).where("guild_1 = ? OR guild_2 = ?", self.id, self.id)
		return res[0] if res.length == 1
		return nil
	end
end
