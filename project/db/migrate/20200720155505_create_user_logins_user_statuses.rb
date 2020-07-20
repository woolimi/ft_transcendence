class CreateUserLoginsUserStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :user_logins_user_statuses, id: :uuid do |t|
      t.references :user_status, null: false, type: :uuid, foreign_key: true
      t.references :user_login, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
