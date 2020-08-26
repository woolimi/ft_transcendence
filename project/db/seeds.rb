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

tournament = Tournament.create(name: 'tournament1', 
	status: :finished, 
	registration_start: DateTime.now - 3.day, 
	registration_end: DateTime.now - 2.day)

users=[user1,user2,user3,user4]
tournament.players.clear
tournament.players.push users

game1=Game.create(game_type: :tournament_semi,
	tournament: tournament,
	status: :finished)
gameUser1=GameUser.create(game: game1, user: user1, points: 10, status: :win, position: :left)
gameUser2=GameUser.create(game: game1, user: user2, points: 8, status: :loose, position: :right)

game2=Game.create(game_type: :tournament_semi,
	tournament: tournament,
	status: :finished)
gameUser3=GameUser.create(game: game2, user: user3, points: 10, status: :win, position: :left)
gameUser4=GameUser.create(game: game2, user: user4, points: 8, status: :loose, position: :right)

game3=Game.create(game_type: :tournament_final,
	tournament: tournament,
	status: :finished)
gameUser5=GameUser.create(game: game3, user: user1, points: 10, status: :win, position: :left)
gameUser6=GameUser.create(game: game3, user: user3, points: 8, status: :loose, position: :right)
