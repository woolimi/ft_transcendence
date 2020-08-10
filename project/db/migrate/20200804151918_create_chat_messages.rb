class CreateChatMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_messages, id: :uuid do |t|
      t.text  :content, null: false
      t.timestamp :timestamp, null: false
      t.references :chat, type: :uuid, foreign_key: true
      t.references :user, type: :uuid, foreign_key: true
    end
  end
end
