class AddIndexToMatches < ActiveRecord::Migration[6.0]
	def change
		add_index :matches, :player_left_id
		add_index :matches, :player_right_id
  end
end
