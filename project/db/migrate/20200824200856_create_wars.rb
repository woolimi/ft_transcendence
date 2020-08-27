class CreateWars < ActiveRecord::Migration[6.0]
  def change
    create_table :wars, id: :uuid do |t|
      t.string :guild_1
      t.string :guild_2
      t.string :guild_1_score
      t.string :guild_2_score
      t.integer :guild_1_matches_won
      t.integer :guild_1_matches_lost
      t.integer :guild_1_matches_unanswered
      t.integer :guild_2_matches_won
      t.integer :guild_2_matches_lost
      t.integer :guild_2_matches_unanswered
      t.datetime :start_date
      t.datetime :end_date
      t.integer :wager
      t.string :match_list
      t.integer :status
      t.boolean :match_ongoing

      t.timestamps
    end
  end
end

