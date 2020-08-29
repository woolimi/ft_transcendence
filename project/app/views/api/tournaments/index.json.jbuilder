json.array! @tournaments do |tournament|
	json.id tournament.id
	json.status tournament.status
	json.name tournament.name
	json.registration_start tournament.registration_start
	json.registration_end tournament.registration_end
	json.players tournament.players.pluck(:id)
	if tournament.status == "started"
		json.semis do
			json.partial! 'api/matches/matches', collection: tournament.matches.where(matcht_type: 'tournament_semi'), as: :match
		end
		if tournament.semis_done?
			json.final do
				json.partial! 'api/matches/matches', match: tournament.matches.where(matcht_type: 'tournament_final').first
			end
		end
	end
end
