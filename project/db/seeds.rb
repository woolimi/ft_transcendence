# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if User.find_by({ email: "doby@asdf.com" }).blank?
	u = User.create!(
		ft_id: 1, 
		email: "doby@asdf.com",
		password: "asdfas",
		# encrypted_password: Digest::SHA1.hexdigest("asdfas")
	)
	UserProfile.create!(
		name: "dongbin",
		nickname: "doby",
		avatar_url: "https://cdn.intra.42.fr/users/small_doby.jpg",
		user_id: u[:id])
end
user1= u;

if User.find_by({ email: "jai@asdf.com"}).blank?
	j = User.create!(
		ft_id: 2, 
		email: "jai@asdf.com",
		password: "asdfas",
		# encrypted_password: Digest::SHA1.hexdigest("asdfas")
	)
	UserProfile.create!(
		name: "jaeseok lee",
		nickname: "jai",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		user_id: j[:id])
end
user2=j

if User.find_by({ email: "email3@email.com"}).blank?
	user3 = User.create!(
			ft_id: 3, 
			email: "email3@email.com",
			password: "coucou",
		)
	UserProfile.create!(
		name: "John",
		nickname: "Jojo",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		user_id: user3[:id])
end

if User.find_by({ email: "email4@email.com"}).blank?
	user4 = User.create!(
			ft_id: 4, 
			email: "email4@email.com",
			password: "coucou",
		)
	UserProfile.create!(
		name: "Maxime",
		nickname: "Max",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		user_id: user4[:id])
end

if Tournament.find_by(name: 'tournament1').blank?
	tournament = Tournament.create(name: 'tournament1', 
		status: :finished, 
		registration_start: DateTime.now - 3.day, 
		registration_end: DateTime.now - 2.day)

	users=[user1,user2,user3,user4]
	tournament.players.clear
	tournament.players.push users

	match1=Match.create(
		match_type: 'tournament_semi',
		tournament: tournament,
		player_left: user1,
		player_right: user2,
		player_1: {score: 10},
		player_2: {score: 8},
		winner: user1.name,
		loser: user2.name,
		# created_at: Time.now()
	)
	match2=Match.create(
		match_type: 'tournament_semi',
		tournament: tournament,
		player_left: user3,
		player_right: user4,
		player_1: {score: 10},
		player_2: {score: 8},
		winner: user3.name,
		loser: user4.name
	)
	match3=Match.create(
		match_type: 'tournament_final',
		tournament: tournament,
		player_left: user1,
		player_right: user3,
		player_1: {score: 10},
		player_2: {score: 8},
		winner: user1.name,
		loser: user3.name
	)
end