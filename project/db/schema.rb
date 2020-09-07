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

ActiveRecord::Schema.define(version: 2020_08_26_123118) do

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

  create_table "guilds", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "anagram"
    t.integer "total_score"
    t.jsonb "guild_officers"
    t.jsonb "guild_members"
    t.uuid "owner"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "matches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "match_type", null: false
    t.jsonb "player_1"
    t.jsonb "player_2"
    t.uuid "winner"
    t.uuid "loser"
    t.datetime "created_at"
    t.datetime "started_at"
    t.boolean "match_finished", default: false
    t.uuid "player_left_id"
    t.uuid "player_right_id"
    t.integer "score_left", default: 0
    t.integer "score_right", default: 0
    t.uuid "war_id"
    t.uuid "tournament_id"
    t.index ["loser"], name: "index_matches_on_loser"
    t.index ["player_left_id"], name: "index_matches_on_player_left_id"
    t.index ["player_right_id"], name: "index_matches_on_player_right_id"
    t.index ["tournament_id"], name: "index_matches_on_tournament_id"
    t.index ["war_id"], name: "index_matches_on_war_id"
    t.index ["winner"], name: "index_matches_on_winner"
  end

  create_table "tournaments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "status", default: 0
    t.jsonb "players"
    t.uuid "semiL_id"
    t.uuid "semiR_id"
    t.uuid "final_id"
    t.uuid "winner"
    t.datetime "registration_start"
    t.datetime "registration_end"
    t.datetime "limit"
    t.index ["final_id"], name: "index_tournaments_on_final_id"
    t.index ["semiL_id"], name: "index_tournaments_on_semiL_id"
    t.index ["semiR_id"], name: "index_tournaments_on_semiR_id"
    t.index ["winner"], name: "index_tournaments_on_winner"
  end

  create_table "user_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "nickname"
    t.string "avatar_url"
    t.string "friend_list", default: [], array: true
    t.string "two_factor", default: "off"
    t.string "block_list", default: [], array: true
    t.integer "status", default: 0
    t.integer "rp", default: 1000
    t.boolean "admin", default: false
    t.uuid "guild_id"
    t.boolean "banned", default: false
    t.uuid "user_id"
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "ft_id", null: false
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
    t.string "string", array: true
    t.index ["ft_id"], name: "index_users_on_ft_id", unique: true
  end

  create_table "wars", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "guild_1"
    t.string "guild_2"
    t.string "guild_1_score"
    t.string "guild_2_score"
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
    t.integer "status"
    t.boolean "match_ongoing"
    t.integer "max_unanswered"
    t.string "war_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "channel_messages", "channels"
  add_foreign_key "channel_messages", "users"
  add_foreign_key "chat_messages", "chats"
  add_foreign_key "chat_messages", "users"
  add_foreign_key "user_profiles", "users"
end
