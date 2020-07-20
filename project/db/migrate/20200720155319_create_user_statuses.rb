class CreateUserStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :user_statuses, id: :uuid do |t|
      t.integer :status

      t.timestamps
    end
  end
end
