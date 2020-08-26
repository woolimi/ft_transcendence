json.array! @tournaments do |tournament|
	json.id tournament.id
	json.status tournament.status
	json.name tournament.name
	json.registration_start tournament.registration_start
	json.registration_end tournament.registration_end
	json.players tournament.players.pluck(:id)
	if tournament.status == "started"
		json.semis do
			json.partial! 'api/games/games', collection: tournament.games.tournament_semi, as: :game
		end
		if tournament.semis_done?
			json.final do
				json.partial! 'api/games/games', game: tournament.games.tournament_final.first
			end
		end
	end
end
