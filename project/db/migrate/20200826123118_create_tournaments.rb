class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments, id: :uuid do |t|
      t.string :name
			t.integer :status, default: 0
      t.datetime :registration_start
      t.datetime :registration_end

      t.timestamps
    end
  end
end
