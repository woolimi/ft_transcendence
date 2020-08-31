class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments, id: :uuid do |t|
      t.string :name
      t.integer :status, default: 0 # 0 pending 1 started 2 finished
      t.jsonb :players # [id1, id2, id3, id4]
      t.uuid :semiL # match_id
      t.uuid :semiR # match_id
      t.uuid :final # match_id
      t.uuid :winner
      t.datetime :registration_start
      t.datetime :registration_end
    end
    add_index :tournaments, :semiL
    add_index :tournaments, :semiR
    add_index :tournaments, :final
  end
end
