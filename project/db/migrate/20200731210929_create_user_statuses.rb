class CreateUserStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :user_statuses, id: :uuid do |t|
      t.integer     :status, null: false, default: 0
      t.references  :user, type: :uuid, foreign_key: true
    end
  end
end
