export interface CreateUserDto {
  name: string;
  email: string;
  role: "admin" | "distributor";
}

export interface CreateUserResponse extends CreateUserDto {
  id: number;
  is_active: boolean;
}