class AddMatchTypeToMatches < ActiveRecord::Migration[6.0]
  def change
    add_column :matches, :match_type, :string
    add_reference :matches, :war,  type: :uuid, foreign_key: true
    rename_column :matches, :player_left, :player_1
    rename_column :matches, :player_right, :player_2
    remove_column :wars, :match_list
  end
end
