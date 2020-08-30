class TournamentRegistrationLimitJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    if tournament.players.count < 4
      tournament.cancel()
    end
  end
end
