class TournamentRegistrationLimitJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    return tournament.cancel() if tournament.players.count < 4
    tournament.launch()
  end
end
