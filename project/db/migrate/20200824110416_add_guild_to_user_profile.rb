class AddGuildToUserProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :user_profiles, :guild, :string
  end
end
