class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games, id: :uuid do |t|
      t.integer :status
      t.integer :game_type
      t.uuid :tournament_id

      t.timestamps
    end
  end
end
