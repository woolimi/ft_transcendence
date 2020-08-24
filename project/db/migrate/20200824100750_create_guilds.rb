class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds, id: :uuid do |t|
      t.string :name
      t.string :anagram
      t.integer :matches_played, default: 0
      t.integer :wins, default: 0
      t.integer :losses, default: 0
      t.integer :total_score, default: 0
      t.datetime :next_war_start, null:true
      t.datetime :next_war_end, null:true
      t.timestamps
    end
  end
end
