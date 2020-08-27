class AddMatchTypeToGames < ActiveRecord::Migration[6.0]
	def change
		add_column :matches, :match_type, :string
  end
end
