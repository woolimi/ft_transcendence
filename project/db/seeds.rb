# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

u = User.create(
	ft_id: 1, 
	email: "doby@asdf.com",
	password: "asdfas");
u.create_user_profile(
name: "dongbin",
nickname: "doby",
avatar_url: "https://cdn.intra.42.fr/users/small_doby.jpg",)

j = User.create(
	ft_id: 2, 
	email: "jai@asdf.com",
	password: "asdfas");
j.create_user_profile(
name: "jaeseok lee",
nickname: "jai",
avatar_url: "https://cdn.intra.42.fr/users/small_jai.jpg",)
