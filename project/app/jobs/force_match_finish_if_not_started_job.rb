class ForceMatchFinishIfNotStartedJob < ApplicationJob
  queue_as :default

  def perform(match)
    match.force_match_finish_if_not_started()
  end
end
