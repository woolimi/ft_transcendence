# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# rails db:drop && rails db:create && rails db:migrate && rails db:seed


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
		user_id: u[:id],
		admin: true
	)
end
user1= User.find_by({ email: "doby@asdf.com" });

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
user2=User.find_by({ email: "jai@asdf.com"})

if User.find_by({ email: "john@asdf.com"}).blank?
	user3 = User.create!(
			ft_id: 3, 
			email: "john@asdf.com",
			password: "asdfas",
		)
	UserProfile.create!(
		name: "John",
		nickname: "Jojo",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		user_id: user3[:id])
end
user3=User.find_by({ email: "john@asdf.com"})


if User.find_by({ email: "max@asdf.com"}).blank?
	user4 = User.create!(
			ft_id: 4, 
			email: "max@asdf.com",
			password: "asdfas",
		)
	UserProfile.create!(
		name: "Maxime",
		nickname: "Max",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		user_id: user4[:id])
end
user4=User.find_by({ email: "max@asdf.com"})

Tournament.delete_all
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
	winner: user1.id,
	loser: user2.id,
	match_finished: true
	# created_at: Time.now()
)
match2=Match.create(
	match_type: 'tournament_semi',
	tournament: tournament,
	player_left: user3,
	player_right: user4,
	player_1: {score: 10},
	player_2: {score: 8},
	winner: user3.id,
	loser: user4.id,
	match_finished: true
)
match3=Match.create(
	match_type: 'tournament_final',
	tournament: tournament,
	player_left: user1,
	player_right: user3,
	player_1: {score: 10},
	player_2: {score: 8},
	winner: user1.id,
	loser: user3.id,
	match_finished: true
)

tournament2 = Tournament.create(name: 'tournament 2', 
	status: :pending, 
	registration_start: DateTime.now, 
	registration_end: DateTime.now + 100.day)
users=[user1,user2,user3]
tournament2.players.clear
tournament2.players.push users
	