class CreateUserLoginsUserStats < ActiveRecord::Migration[6.0]
  def change
    create_table :user_logins_user_stats, id: :uuid do |t|
      t.references :user_stat, null: false, type: :uuid, foreign_key: true
      t.references :user_login, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
