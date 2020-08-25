class AddGuildIdToUserProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :user_profiles, :guild_id, :string
  end
end
