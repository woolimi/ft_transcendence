class CreateUserLogins < ActiveRecord::Migration[6.0]
  def change
    create_table :user_logins, id: :uuid do |t|
      t.string :ft_id
      t.string :session_id
      t.string :access_token
      t.string :refresh_token
      t.string :token_expires_in

      t.timestamps
    end
    add_index :user_logins, :ft_id, unique: true
  end
end
