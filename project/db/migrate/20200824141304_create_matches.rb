class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches, id: :uuid do |t|
      t.string :match_type, null: false
      t.jsonb :player1
      t.jsonb :player2
      t.string :winner
      t.string :loser
      t.timestamp :created_at
      t.timestamp :started_at
    end
  end
end
