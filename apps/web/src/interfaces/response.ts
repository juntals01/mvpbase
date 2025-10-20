// Profile
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  phoneNumber: string | null;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
