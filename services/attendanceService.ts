
import { AttendanceRecord } from '../types';
import { STORAGE_KEYS } from '../constants';

export const attendanceService = {
  getRecords: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  submitRecord: (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const records = attendanceService.getRecords();
    const newRecord: AttendanceRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return newRecord;
  },

  updateRecordStatus: (id: string, status: AttendanceRecord['status']): void => {
    const records = attendanceService.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    }
  },

  getUserRecords: (userId: string): AttendanceRecord[] => {
    return attendanceService.getRecords().filter(r => r.userId === userId);
  },

  exportToCSV: (records: AttendanceRecord[]): string => {
    const headers = ['ID', 'User', 'Time', 'Address', 'Lat', 'Lng', 'Distance', 'Status', 'Notes'];
    const rows = records.map(r => [
      r.id,
      r.userName,
      new Date(r.timestamp).toLocaleString(),
      `"${r.address || 'Unknown'}"`,
      r.latitude,
      r.longitude,
      `${r.distanceFromOffice.toFixed(0)}m`,
      r.status,
      `"${r.notes || ''}"`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
};
