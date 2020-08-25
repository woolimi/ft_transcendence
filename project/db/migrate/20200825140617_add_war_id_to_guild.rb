class AddWarIdToGuild < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds, :war_id, :string
  end
end
