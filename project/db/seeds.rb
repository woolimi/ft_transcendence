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

if User.find_by({ email: "tintin@asdf.com"}).blank?
	u = User.create!(
		ft_id: 3, 
		email: "tintin@asdf.com",
		password: "asdfas",
	)

	UserProfile.create!(
		name: "Tintin",
		nickname: "tintin",
		avatar_url: "https://anniversaire-celebrite.com/upload/250x333/tintin-250.jpg",
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
		avatar_url: "https://cdn.intra.42.fr/users/small_benny.jpeg",
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

if User.find_by({ email: "wpark@student.42.fr"}).blank?
	u = User.create!(
		ft_id: 57601,
		email:  "wpark@student.42.fr",
		password: "asdfas"
	)
	UserProfile.create!(
		name: "Woolim PARK",
		nickname: "wpark",
		avatar_url: "https://cdn.intra.42.fr/users/small_wpark.jpg",
		rp: 1000,
		user_id: u[:id],
		admin: true)
end