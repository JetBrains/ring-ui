export interface AuthUser {
  guest?: boolean;
  id: string;
  name: string;
  login: string;
  banned?: boolean;
  banReason?: string;
  profile?: {
    avatar?: {
      url?: string;
    };
    email?: {
      email?: string;
    };
  };
}

export interface AuthResponse {
  accessToken?: string;
  state?: string;
  token_type?: string;
  expiresIn?: string;
  scope?: string;
  error?: string | Error;
  errorDescription?: string;
  errorUri?: string;
  restoreAuthState?: string;
}
