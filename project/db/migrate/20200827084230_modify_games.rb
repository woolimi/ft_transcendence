class ModifyGames < ActiveRecord::Migration[6.0]
	def change
		drop_table :game_users
		drop_table :games
		# rename_table :games, :matches
		rename_column :matches, :player_left, :player_1
		rename_column :matches, :player_right, :player_2
		add_reference :matches, :war, type: :uuid, foreign_key: true
		add_reference :matches, :tournament, type: :uuid, foreign_key: true
  end
end
