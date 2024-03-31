export interface UserProps {
  user_id: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
}
export interface UserResponseProps {
  user: UserProps;
  token: string;
  profile_picture: string;
  message: string;
}

export interface SignInInputProps {
  email: string;
  password: string;
}

export interface SignUpInputProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}
export interface ChangePasswordProps {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
}

export interface DecodedTokenProps {
  user_id: string;
  username: string;
  exp: number;
}
