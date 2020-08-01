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
	UserStatus.create!(
		status: 0,
		user_id: u[:id]
	)
end

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
	UserStatus.create!(
		status: 0,
		user_id: j[:id]
	)
end

