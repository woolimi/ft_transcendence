class CreateChatMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_messages, id: :uuid do |t|
      t.uuid  :written_by, null: false
      t.text  :content, null: false
      t.timestamps
      t.references :chat, type: :uuid, foreign_key: true
    end
  end
end
