class AddMatchOngoingToWars < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :match_ongoing, :boolean
  end
end
