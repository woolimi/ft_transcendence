class AddGuildOfficersToGuild < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds, :guild_officers, :jsonb
    remove_column :guilds, :war_id
    add_reference :guilds, :user_profile,  type: :uuid, foreign_key: true
    rename_column :guilds, :user_profile_id, :owner
  end
end
