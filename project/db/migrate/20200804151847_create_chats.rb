class CreateChats < ActiveRecord::Migration[6.0]
  def change
    create_table :chats, id: :uuid do |t|
      t.string  :room, null: false
      t.integer :unread, null: false
      t.jsonb :members, null: false, array: true
    end
    add_index :chats, :room, unique: true
  end
end
