class AddMaxUnansweredToWar < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :max_unanswered, :integer
  end
end
