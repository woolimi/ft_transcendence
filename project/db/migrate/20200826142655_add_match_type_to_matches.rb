class AddMatchTypeToMatches < ActiveRecord::Migration[6.0]
  def change
    add_column :matches, :match_type, :string
    add_reference :matches, :war,  type: :uuid, foreign_key: true
  end
end
