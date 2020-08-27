json.id @tournament.id
json.status @tournament.status
json.name @tournament.name
json.registration_start @tournament.registration_start
json.registration_end @tournament.registration_end
# json.players @tournament.players.pluck(:name) # :id
json.players do
	json.array! @tournament.players do |player|
		json.id player.id
		json.name player.user_profile.name
	end
end
json.winner @tournament.winner if @tournament.winner != ''
json.semis do
	json.partial! 'api/matches/matches', collection: @tournament.matches.where(match_type: 'tournament_semi'), as: :match
end
if @tournament.semis_done?
	json.final do
		json.partial! 'api/matches/matches', match: @tournament.matches.where(match_type: 'tournament_final').first
	end
end
