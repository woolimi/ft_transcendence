class CreateUserLoginsUserProfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :user_logins_user_profiles, id: :uuid do |t|
      t.references :user_profile, null: false, type: :uuid, foreign_key: true
      t.references :user_login, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
