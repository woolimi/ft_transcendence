class AddAdminToUserProfile < ActiveRecord::Migration[6.0]
	def change
		add_column :user_profiles, :admin, :boolean, default: false	
  end
end
