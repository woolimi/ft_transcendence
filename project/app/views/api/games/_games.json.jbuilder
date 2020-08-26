json.id game.id
json.player_one do
	begin
		json.points game.users.first.game_points(game)
		json.partial! 'users/users', user: game.users.first
	rescue => exception
		json.null!
	end
end
json.player_two do
	begin
		json.points game.users.second.game_points(game)
		json.partial! 'users/users', user: game.users.second
	rescue => exception
		json.null!
	end
end
json.game_type game.game_type
json.status game.status
json.winner game.winner.id if game.finished?
