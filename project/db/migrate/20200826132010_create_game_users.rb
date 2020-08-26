class CreateGameUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :game_users, id: :uuid do |t|
      t.uuid :game_id
      t.uuid :user_id
			t.integer :status, default: 0
			t.integer :points, default: 0
			t.integer :position # left or right
      t.timestamps
    end
  end
end
