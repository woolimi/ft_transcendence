class CreateUserProfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :user_profiles, id: :uuid do |t|
      t.string :user_name
      t.string :display_name
      t.boolean :two_factor
      t.string :avatar_url
      t.string :friend_list
      t.string :block_list
      t.boolean :is_owner
      t.boolean :is_officer
      t.boolean :is_admin

      t.timestamps
    end
  end
end
