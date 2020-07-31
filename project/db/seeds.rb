# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

u = User.find_or_create_by(
	ft_id: 1, 
	email: "doby@asdf.com",
	encrypted_password: Digest::SHA1.hexdigest("asdfas"));
UserProfile.find_or_create_by(
name: "dongbin",
nickname: "doby",
avatar_url: "https://cdn.intra.42.fr/users/small_doby.jpg",
user_id: u[:user_id])

j = User.find_or_create_by(
	ft_id: 2, 
	email: "jai@asdf.com",
	encrypted_password: Digest::SHA1.hexdigest("asdfas"));
UserProfile.find_or_create_by(
name: "jaeseok lee",
nickname: "jai",
avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",
user_id: j[:user_id])
