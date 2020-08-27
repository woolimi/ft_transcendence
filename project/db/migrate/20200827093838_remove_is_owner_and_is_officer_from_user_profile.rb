class RemoveIsOwnerAndIsOfficerFromUserProfile < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_profiles, :is_owner, :boolean
    remove_column :user_profiles, :is_officer, :boolean
  end
end
