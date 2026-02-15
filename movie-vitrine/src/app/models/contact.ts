
export interface ContactRequest {
  userId: number;
  userInput: string;
  email: string;
  subject: string;
}

export interface SpamResponse {
  prediction: string;
}