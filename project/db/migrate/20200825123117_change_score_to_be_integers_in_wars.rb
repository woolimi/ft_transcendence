class ChangeScoreToBeIntegersInWars < ActiveRecord::Migration[6.0]
  def change
    change_column :wars, :guild_1_score, :integer, using: 'guild_1_score::integer'
    change_column :wars, :guild_2_score, :integer, using: 'guild_2_score::integer'
  end
end
