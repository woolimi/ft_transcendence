class CreateChannels < ActiveRecord::Migration[6.0]
  def change
    create_table :channels, id: :uuid do |t|
      t.string :room, null: false, uniqueness: true
      t.string :channel_type, null: false
      t.string :password
      t.jsonb :owner, null: false
      t.jsonb :admins
      t.jsonb :members
      t.jsonb :bans
      t.jsonb :mutes
    end
    add_index :channels, :room, unique: true
  end
end
