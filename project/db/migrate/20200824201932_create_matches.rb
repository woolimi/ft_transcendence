class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches, id: :uuid do |t|
      t.string :score
      t.string :players
      t.string :winner
      t.string :loser

      t.timestamps
    end
  end
end
