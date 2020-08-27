class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches, id: :uuid do |t|
      t.string :match_type, null: false
      t.jsonb :player_1
      t.jsonb :player_2
      t.uuid :winner
      t.uuid :loser
      t.datetime :created_at
      t.datetime :started_at
      t.boolean :match_finished
      t.uuid :player_left 
      t.uuid :player_right
      t.integer :score_left
      t.integer :score_right
      t.uuid :war_id
    end
    add_index :matches, :war_id
  end
end

# add_reference :matches, :war,  type: :uuid, foreign_key: true