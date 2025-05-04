export type MessagePayload = {
    receiver_user_id: string;
    message: string;
  };
  
export type MessageResponse = {
    message: string;
    sender_user_id: string;
    timestamp: string;
  };
  