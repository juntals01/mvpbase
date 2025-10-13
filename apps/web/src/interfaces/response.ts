// Profile
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
