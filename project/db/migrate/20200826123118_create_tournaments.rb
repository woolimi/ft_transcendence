class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments, id: :uuid do |t|
      t.string :name
      t.integer :status, default: 0 # 0 waiting 1 semifinal 2 final 3 finished
      t.jsonb :players # [id1, id2, id3, id4]
      t.uuid :semiL_id # match_id
      t.uuid :semiR_id # match_id
      t.uuid :final_id # match_id
      t.uuid :winner
      t.datetime :registration_start
      t.datetime :registration_end
      t.datetime :limit
    end
    add_index :tournaments, :semiL_id
    add_index :tournaments, :semiR_id
    add_index :tournaments, :final_id
    add_index :tournaments, :winner
  end
end
