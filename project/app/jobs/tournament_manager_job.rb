class TournamentManagerJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.manage()
  end
end
