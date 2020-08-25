class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds, id: :uuid do |t|
      t.string :name
      t.string :anagram
      t.integer :total_score

      t.timestamps
    end
  end
end
