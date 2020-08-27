class AddStatusToWar < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :status, :string
  end
end
