class AddLeftRightScoresPlayersToMatches < ActiveRecord::Migration[6.0]
  def change
    add_column :matches, :score_left, :integer
    add_column :matches, :score_right, :integer
    add_column :matches, :player_left, :string
    add_column :matches, :player_right, :string
  end
end
