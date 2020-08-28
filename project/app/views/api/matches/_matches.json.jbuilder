json.id match.id
json.player_one do
	# begin
		json.points match.player_1['score']
		json.partial! 'api/users/users', user: match.player_left
	# rescue => exception
	# 	json.null!
	# end
end
json.player_two do
	# begin
		json.points match.player_2['score']
		json.partial! 'api/users/users', user: match.player_right
	# rescue => exception
	# 	json.null!
	# end
end
json.match_type match.match_type
# json.status match.status
json.winner match.winner if match.match_finished
