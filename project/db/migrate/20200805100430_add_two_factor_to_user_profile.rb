class AddTwoFactorToUserProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :user_profiles, :two_factor, :string, default: 'off'
    add_column :user_profiles, :block_list, :string, array: true, default: []
  end
end
