class TournamentRegistrationLimitJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    if tournament.players.count < 4
      tournament.cancel()
      ActionCable.server.broadcast "tournament_#{tournament.id}_channel", {type: "canceled" }
    else
      tournament.launch()
      ActionCable.server.broadcast "tournament_#{tournament.id}_channel", {type: "launch", data: tournament.jbuild() }
    end
  end
end
