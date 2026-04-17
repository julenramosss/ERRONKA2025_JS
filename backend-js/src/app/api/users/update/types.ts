export interface UpdateUserDto {
  id: number;
  name?: string;
  email?: string;
}

export interface UpdateUserResponse {
  id: number;
  name: string;
  email: string;
}
