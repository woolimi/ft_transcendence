class ChangeMatches < ActiveRecord::Migration[6.0]
	def change
		remove_column :matches, :player_1
		remove_column :matches, :player_2
		remove_column :matches, :score_left
		remove_column :matches, :score_right
		add_column :matches, :player_1, :jsonb
		add_column :matches, :player_2, :jsonb
		add_column :matches, :player_left_id, :uuid
		add_index :matches, :player_left_id
		add_column :matches, :player_right_id, :uuid
		add_index :matches, :player_right_id
  end
end
