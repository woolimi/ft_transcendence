class TournamentRegistrationLimitJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    return tournament.cancel() if tournament.players.count < 4
    tournament.launch()
    ActionCable.server.broadcast "tournament_#{tournament.id}_channel", tournament.jbuild()
  end
end
