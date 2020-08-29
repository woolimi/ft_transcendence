class TournamentRegistrationLimitJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    if tournament.players.count < 4
      tournament.finished!
      # todo : notification to the users
      # who subscribed, to tell them that it was 
      # cancelled
    end
  end
end
