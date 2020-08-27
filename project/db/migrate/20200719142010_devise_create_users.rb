# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users, id: :uuid do |t|
      t.integer   :ft_id, null: false, index: { unique: true } # 42 id num      

      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.timestamps null: false
      t.string :encrypted_otp_secret
      t.string :encrypted_otp_secret_iv
      t.string :encrypted_otp_secret_salt
      t.integer :consumed_timestep
      t.boolean :otp_required_for_login
      t.string :otp_backup_codes, :string, array: true
    end
  end
end
