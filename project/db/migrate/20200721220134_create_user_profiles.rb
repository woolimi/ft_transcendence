class CreateUserProfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :user_profiles, id: :uuid do |t|
      t.string :name
      t.string :nickname
      t.string :avatar_url
      t.references :user, type: :uuid, foreign_key: true
    end
  end
end
