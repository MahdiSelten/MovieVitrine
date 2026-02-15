export interface User {
  _id?: string;
  username: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  createdAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}