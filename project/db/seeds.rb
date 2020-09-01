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
	)
	UserProfile.create!(
		name: "dongbin",
		nickname: "doby",
		avatar_url: "https://cdn.intra.42.fr/users/small_doby.jpg",
		rp: 900,
		user_id: u[:id],
		admin: true
	)
end

if User.find_by({ email: "jai@asdf.com"}).blank?
	u = User.create!(
		ft_id: 2, 
		email: "jai@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "jaeseok lee",
		nickname: "jai",
		avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
		rp: 1160,
		user_id: u[:id])
end

if User.find_by({ email: "salty@asdf.com"}).blank?
	u = User.create!(
		ft_id: 3, 
		email: "salty@asdf.com",
		password: "asdfas",
	)

	UserProfile.create!(
		name: "Adrien Hanot",
		nickname: "salty",
		avatar_url: "https://cdn.intra.42.fr/users/small_salty.jpg",
		rp: 1320,
		user_id: u[:id])
end

if User.find_by({ email: "noich@asdf.com"}).blank?
	u = User.create!(
		ft_id: 4, 
		email: "noich@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Vincent Rey",
		nickname: "noich",
		avatar_url: "https://cdn.intra.42.fr/users/small_noich.jpg",
		rp: 1560,
		user_id: u[:id])
end

if User.find_by({ email: "benny@asdf.com"}).blank?
	u = User.create!(
		ft_id: 5, 
		email: "benny@asdf.com",
		password: "asdfas",
	)

	UserProfile.create!(
		name: "Benny Scetbun",
		nickname: "benny",
		avatar_url: "https://cdn.intra.42.fr/users/small_benny.jpg",
		rp: 1780,
		user_id: u[:id])
end

if User.find_by({ email: "sophie@asdf.com"}).blank?
	u = User.create!(
		ft_id: 6, 
		email: "sophie@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Sophie Viger",
		nickname: "sophie",
		avatar_url: "https://cdn.intra.42.fr/users/small_sophie.jpg",
		rp: 1860,
		user_id: u[:id])
end

if User.find_by({ email: "ol@asdf.com"}).blank?
	u = User.create!(
		ft_id: 7, 
		email: "ol@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Olivier Crouzet",
		nickname: "ol",
		avatar_url: "https://cdn.intra.42.fr/users/small_ol.jpg",
		rp: 1500,
		user_id: u[:id])
end


if User.find_by({ email: "snow@asdf.com"}).blank?
	u = User.create!(
		ft_id: 8, 
		email: "snow@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Abel Moreau",
		nickname: "snow",
		avatar_url: "https://cdn.intra.42.fr/users/small_snow.jpg",
		rp: 1550,
		user_id: u[:id])
end

if User.find_by({ email: "jerry@asdf.com"}).blank?
	u = User.create!(
		ft_id: 9, 
		email: "jerry@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Theophile Delmas",
		nickname: "jerry",
		avatar_url: "https://cdn.intra.42.fr/users/small_jerry.gif",
		rp: 1550,
		user_id: u[:id])
end

if User.find_by({ email: "charly@asdf.com"}).blank?
	u = User.create!(
		ft_id: 10, 
		email: "charly@asdf.com",
		password: "asdfas",
	)
	UserProfile.create!(
		name: "Charles Maublanc",
		nickname: "charly",
		avatar_url: "https://cdn.intra.42.fr/users/small_charly.jpg",
		rp: 1630,
		user_id: u[:id])
end

if User.find_by({ email: "admin@asdf.com"}).blank?
	u = User.create!(
		ft_id: 11, 
		email: "admin@asdf.com",
		password: "asdfas",
	)
end

if Guild.find_by(name: 'Mumbai Indians').blank?
	u1 = User.find_by({ email: "jai@asdf.com"})
	g1 = Guild.create(
		name: "Mumbai Indians",
		anagram: "mindia",
		total_score: 5,
		guild_officers: "{}",
		owner: u1[:id]
	)
end
if Guild.find_by(name: 'Chennai Super Kings').blank?
	
	u2 = UserProfile.find_by({ name: "dongbin"})
	g2 = Guild.create(
		name: "Chennai Super Kings",
		anagram: "chenia",
		total_score: 4,
		guild_officers: "{}",
		owner: u2[:user_id]
	)
end

if War.all.blank?
	g1 = Guild.find_by({ name: 'Mumbai Indians'})
	g2 = Guild.find_by({ name: 'Chennai Super Kings'})

	u1 = User.find_by({ email: "jai@asdf.com"})
	u2 = User.find_by({ email: "doby@asdf.com"})

	
	w1 = War.create(
		guild_1: g1[:id],
		guild_2: g2[:id],
		guild_1_score: 10,
		guild_2_score: 5,
		guild_1_matches_won: 2,
		guild_1_matches_lost: 1,
		guild_1_matches_unanswered: 0,
		guild_2_matches_won: 1,
		guild_2_matches_lost: 2,
		guild_2_matches_unanswered: 0,
		start_date: Time.now.to_datetime,
		end_date: (Time.now + 100000).to_datetime,
		wager: 20,
		match_list: "",
		status: 2,
		match_ongoing: false
	)

	match1=Match.create(
		match_type: 'war',
		player_1: {score: 10},
		player_2: {score: 8},
		winner: u1[:id],
		loser: u2[:id],
		match_finished: true,
		player_left_id: u1[:id],
		player_right_id: u2[:id],
		score_left: 10,
		score_right: 8,
		war_id: w1[:id]
	)

	match2=Match.create(
		match_type: 'war',
		player_1: {score: 10},
		player_2: {score: 2},
		winner: u1[:id],
		loser: u2[:id],
		match_finished: true,
		player_left_id: u1[:id],
		player_right_id: u2[:id],
		score_left: 10,
		score_right: 2,
		war_id: w1[:id]
	)

	match3=Match.create(
		match_type: 'war',
		player_1: {score: 6},
		player_2: {score: 10},
		winner: u2[:id],
		loser: u1[:id],
		match_finished: true,
		player_left_id: u1[:id],
		player_right_id: u2[:id],
		score_left: 6,
		score_right: 10,
		war_id: w1[:id]
	)

	UserProfile.create!(
		name: "Admin",
		nickname: "admin",
		avatar_url: "https://cdn.intra.42.fr/users/small_wpark.jpg",
		rp: 0,
		admin: true,
		user_id: u[:id])
end

# user1= User.find_by({ email: "doby@asdf.com" });
# user2= User.find_by({ email: "jai@asdf.com" });
# user3= User.find_by({ email: "sophie@asdf.com" });
# user4= User.find_by({ email: "benny@asdf.com" });

# Tournament.delete_all
# tournament = Tournament.create(name: 'tournament1', 
# 	status: :finished, 
# 	registration_start: DateTime.now - 3.day, 
# 	registration_end: DateTime.now - 2.day)

# users=[user1,user2,user3,user4]
# tournament.players.clear
# tournament.players.push users

# match1=Match.create(
# 	match_type: 'tournament_semi',
# 	tournament: tournament,
# 	player_left: user1,
# 	player_right: user2,
# 	player_1: {score: 10},
# 	player_2: {score: 8},
# 	winner: user1.id,
# 	loser: user2.id,
# 	match_finished: true
# 	# created_at: Time.now()
# )
# match2=Match.create(
# 	match_type: 'tournament_semi',
# 	tournament: tournament,
# 	player_left: user3,
# 	player_right: user4,
# 	player_1: {score: 10},
# 	player_2: {score: 8},
# 	winner: user3.id,
# 	loser: user4.id,
# 	match_finished: true
# )
# match3=Match.create(
# 	match_type: 'tournament_final',
# 	tournament: tournament,
# 	player_left: user1,
# 	player_right: user3,
# 	player_1: {score: 10},
# 	player_2: {score: 8},
# 	winner: user1.id,
# 	loser: user3.id,
# 	match_finished: true
# )

# tournament2 = Tournament.create(name: 'tournament 2', 
# 	status: :pending, 
# 	registration_start: DateTime.now, 
# 	registration_end: DateTime.now + 100.day)
# users=[user3,user2,user1]
# tournament2.players.clear
# tournament2.players.push users
	
