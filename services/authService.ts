
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * Real-world security best practices implemented in this architectural design:
 * 1. HTTPS Required: Geolocation and Camera APIs are only available over secure connections.
 * 2. Token-Based Auth: In production, sessions would be handled via JWT or Firebase Auth.
 * 3. Geofence Server Validation: Coordinates should be signed and verified on the server-side to prevent client spoofing.
 * 4. Anti-Spoofing: Use timestamp drift checks and IP geolocation reconciliation.
 */

export const authService = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.reload();
  }
};
