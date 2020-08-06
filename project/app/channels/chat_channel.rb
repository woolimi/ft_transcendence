class ChatChannel < ApplicationCable::Channel
  def subscribed
    reject if !is_valide_room?(params[:room])
    chat = Chat.find_by(room: params[:room])
    if chat.blank?
      chat = Chat.create({
        room: params[:room],
        members: [
          {user_id: @u0.user_id, name: @u0.name, nickname: @u0.nickname, avatar_url: @u0.avatar_url, timestamp: Time.now.to_i},
          {user_id: @u1.user_id, name: @u1.name, nickname: @u1.nickname, avatar_url: @u1.avatar_url, timestamp: Time.now.to_i}
        ]
      });
    end
    stream_from "chat_#{params[:room]}_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private
  def is_valide_room? room
    users = room.split("_");
    if !users.include?(current_user[:id])
      return false;
    end
    @u0 = UserProfile.find_by(user_id: users[0]);
    @u1 = UserProfile.find_by(user_id: users[1]);
    if @u0.blank? || @u1.blank?
      return false;
    end
    return true
  end
end
