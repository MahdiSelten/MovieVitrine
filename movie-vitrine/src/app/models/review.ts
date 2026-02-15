export interface Review {
  _id?: string;
  userId: string;
  movieId: number;
  content: string;
  rating: number;
  sentiment?: number[];
  isPositive?: boolean;
  userName?: string;
  createdAt?: Date;
}

export interface ReviewRequest {
  userId: number;
  userInput: string;
  movieId: number;
  rating: number;
}

export interface ReviewResponse {
  prediction: number; 
}