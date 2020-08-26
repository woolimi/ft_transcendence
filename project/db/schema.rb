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

ActiveRecord::Schema.define(version: 2020_08_26_132010) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "channel_messages", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "timestamp", null: false
    t.uuid "channel_id"
    t.uuid "user_id"
    t.index ["channel_id"], name: "index_channel_messages_on_channel_id"
    t.index ["user_id"], name: "index_channel_messages_on_user_id"
  end

  create_table "channels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "room", null: false
    t.string "channel_type", null: false
    t.string "password"
    t.string "owner", null: false
    t.jsonb "admins"
    t.jsonb "members"
    t.jsonb "bans"
    t.jsonb "mutes"
    t.index ["room"], name: "index_channels_on_room", unique: true
  end

  create_table "chat_messages", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "timestamp", null: false
    t.uuid "chat_id"
    t.uuid "user_id"
    t.index ["chat_id"], name: "index_chat_messages_on_chat_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "room", null: false
    t.jsonb "members", null: false, array: true
    t.index ["room"], name: "index_chats_on_room", unique: true
  end

  create_table "game_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "game_id"
    t.uuid "user_id"
    t.integer "status", default: 0
    t.integer "points", default: 0
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "games", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "status"
    t.integer "game_type"
    t.uuid "tournament_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "guilds", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "anagram"
    t.integer "total_score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "war_id"
  end

  create_table "matches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "winner"
    t.string "loser"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "score_left"
    t.integer "score_right"
    t.string "player_left"
    t.string "player_right"
  end

  create_table "tournament_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tournament_id"
    t.uuid "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "tournaments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "status", default: 0
    t.datetime "registration_start"
    t.datetime "registration_end"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "nickname"
    t.string "avatar_url"
    t.string "friend_list", default: [], array: true
    t.string "two_factor", default: "off"
    t.string "block_list", default: [], array: true
    t.integer "status", default: 0
    t.uuid "user_id"
    t.string "guild_id"
    t.boolean "is_owner", default: false
    t.boolean "is_officer", default: false
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "ft_id", null: false
    t.string "session_id"
    t.string "access_token"
    t.string "refresh_token"
    t.datetime "token_expires_in"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.integer "consumed_timestep"
    t.boolean "otp_required_for_login"
    t.string "otp_backup_codes", array: true
    t.index ["ft_id"], name: "index_users_on_ft_id", unique: true
  end

  create_table "wars", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "guild_1"
    t.string "guild_2"
    t.integer "guild_1_score"
    t.integer "guild_2_score"
    t.integer "guild_1_matches_won"
    t.integer "guild_1_matches_lost"
    t.integer "guild_1_matches_unanswered"
    t.integer "guild_2_matches_won"
    t.integer "guild_2_matches_lost"
    t.integer "guild_2_matches_unanswered"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer "wager"
    t.string "match_list"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status"
  end

  add_foreign_key "channel_messages", "channels"
  add_foreign_key "channel_messages", "users"
  add_foreign_key "chat_messages", "chats"
  add_foreign_key "chat_messages", "users"
  add_foreign_key "user_profiles", "users"
end
