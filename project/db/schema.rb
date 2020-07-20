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

ActiveRecord::Schema.define(version: 2020_07_20_155505) do

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

  create_table "user_logins_user_profiles", force: :cascade do |t|
    t.uuid "user_profile_id", null: false
    t.uuid "user_login_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_login_id"], name: "index_user_logins_user_profiles_on_user_login_id"
    t.index ["user_profile_id"], name: "index_user_logins_user_profiles_on_user_profile_id"
  end

  create_table "user_logins_user_stats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_stat_id", null: false
    t.uuid "user_login_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_login_id"], name: "index_user_logins_user_stats_on_user_login_id"
    t.index ["user_stat_id"], name: "index_user_logins_user_stats_on_user_stat_id"
  end

  create_table "user_logins_user_statuses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_status_id", null: false
    t.uuid "user_login_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_login_id"], name: "index_user_logins_user_statuses_on_user_login_id"
    t.index ["user_status_id"], name: "index_user_logins_user_statuses_on_user_status_id"
  end

  create_table "user_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_name"
    t.string "display_name"
    t.boolean "two_factor"
    t.string "avatar_url"
    t.string "friend_list"
    t.string "block_list"
    t.boolean "is_owner"
    t.boolean "is_officer"
    t.boolean "is_admin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_stats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "wins_no"
    t.integer "losses_no"
    t.integer "ladder_level"
    t.integer "tournament_wins"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_statuses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  add_foreign_key "user_logins_user_profiles", "user_logins"
  add_foreign_key "user_logins_user_profiles", "user_profiles"
  add_foreign_key "user_logins_user_stats", "user_logins"
  add_foreign_key "user_logins_user_stats", "user_stats"
  add_foreign_key "user_logins_user_statuses", "user_logins"
  add_foreign_key "user_logins_user_statuses", "user_statuses"
end
