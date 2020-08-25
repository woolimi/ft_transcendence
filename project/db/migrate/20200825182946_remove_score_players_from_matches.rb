class RemoveScorePlayersFromMatches < ActiveRecord::Migration[6.0]
  def change
    remove_column :matches, :score
    remove_column :matches, :players
  end
end
