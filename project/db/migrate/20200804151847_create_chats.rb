class CreateChats < ActiveRecord::Migration[6.0]
  def change
    create_table :chats, id: :uuid do |t|
      t.jsonb :members
    end
  end
end
