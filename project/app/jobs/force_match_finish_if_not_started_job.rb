class ForceMatchFinishIfNotStartedJob < ApplicationJob
  queue_as :default

  def perform(*matches)
    if matches.length == 2
      matches[0].force_match_finish_if_not_started()
      matches[1].force_match_finish_if_not_started()
    else
      matches[0].force_match_finish_if_not_started()
    end
  end
end
