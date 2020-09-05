class AddWarTypeToWar < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :war_type, :string
  end
end
