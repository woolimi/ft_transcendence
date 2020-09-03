class AddBannedToUserProfiles < ActiveRecord::Migration[6.0]
  def change
    add_column(:user_profiles, :banned, :boolean, default: false)
  end
end
