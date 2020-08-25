class AddIsOwnerAndIsOfficerToUserProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :user_profiles, :is_owner, :boolean, default:false
    add_column :user_profiles, :is_officer, :boolean, default:false
  end
end
