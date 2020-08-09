class CreateUserProfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :user_profiles, id: :uuid do |t|
      t.string  :name
      t.string  :nickname
      t.string  :avatar_url
      t.string  :friend_list, array: true, default: []
      t.string  :two_factor, default: 'off'
      t.string  :block_list, array: true, default: []
      t.integer :status, default: 0
      t.references :user, type: :uuid, foreign_key: true
    end
  end
end
