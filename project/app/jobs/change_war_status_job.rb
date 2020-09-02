class ChangeWarStatusJob < ApplicationJob
  queue_as :default

  def perform(war)
    if (war)
      war.status = war.status + 1
      war.save()
    end
    # Do something later
  end
end
