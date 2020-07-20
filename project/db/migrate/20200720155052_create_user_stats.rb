class CreateUserStats < ActiveRecord::Migration[6.0]
  def change
    create_table :user_stats, id: :uuid do |t|
      t.integer :wins_no
      t.integer :losses_no
      t.integer :ladder_level
      t.integer :tournament_wins

      t.timestamps
    end
  end
end
