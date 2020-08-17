class CreateChannelMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :channel_messages do |t|
      t.text  :content, null: false
      t.timestamp :timestamp, null: false
      t.references :channel, type: :uuid, foreign_key: true
      t.references :user, type: :uuid, foreign_key: true
    end
  end
end
