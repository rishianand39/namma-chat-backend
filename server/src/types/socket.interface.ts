export type MessagePayload = {
  receiver_user_id: string;
  message: string;
};

export type MessageResponse = {
  message: string;
  sender_user_id: string;
  timestamp: string;
  message_id: string;
};


export type ReadMessagePayload = {
  message_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  read_at: Date;
}


export type TypingEventPayload = {
  to_user_id : string;
  from_user_id : string;
}
