class CreateTournamentUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :tournament_users, id: :uuid do |t|
      t.uuid :tournament_id
      t.uuid :user_id

      t.timestamps
    end
  end
end
