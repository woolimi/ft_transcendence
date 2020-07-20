# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_20_110127) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "user_logins", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "ft_id"
    t.string "session_id"
    t.string "access_token"
    t.string "refresh_token"
    t.string "token_expires_in"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ft_id"], name: "index_user_logins_on_ft_id", unique: true
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "ft_id", null: false
    t.string "session_id"
    t.string "access_token"
    t.string "refresh_token"
    t.datetime "token_expires_in"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ft_id"], name: "index_users_on_ft_id", unique: true
  end

end
