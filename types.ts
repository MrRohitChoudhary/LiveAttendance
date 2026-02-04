
export type UserRole = 'worker' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  // Add missing property used for geofencing verification
  distanceFromOffice: number;
  address?: string;
  photoUrl?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  deviceInfo: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}