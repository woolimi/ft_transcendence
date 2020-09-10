class GameStartJob < ApplicationJob
  queue_as :default

  def perform(match_id, players)
    MatchChannel.game_start(match_id, players)
  end
end
