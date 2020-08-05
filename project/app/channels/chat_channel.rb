class ChatChannel < ApplicationCable::Channel
  def subscribed
    reject if current_user[:id] == params[:opponent_id]
    op = User.find_by(id: params[:opponent_id])
    reject if op.blank?

    room_name = make_room_name(current_user[:id], params[:opponent_id])
    chat = Chat.find_by(name: room_name);
    if chat.blank?
      chat = Chat.create({
        name: room_name,
        members: [
          {user_id: current_user[:id], timestamp: Time.now.to_i},
          {user_id: params[:opponent_id], timestamp: Time.now.to_i}
        ]
      });
    end
    stream_from "chat_#{room_name}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private
  def make_room_name s1, s2
    if (s1 < s2)
      return s1 + "_" + s2
    end
    return s2 + "_" + s1
  end
end
