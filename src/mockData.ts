
import { User, Department, SchClass, CheckinoutLog } from './types';

export const mockUsers: User[] = [
  {
    USERID: 101,
    NAME: "Alice Smith",
    BADGENUMBER: "EMP001",
    DEFAULTDEPTID: 1,
    PHOTO: "https://images.unsplash.com/photo-1494790108755-2616b612b563?w=150&h=150&fit=crop&crop=face"
  },
  {
    USERID: 102,
    NAME: "Bob Johnson",
    BADGENUMBER: "EMP002",
    DEFAULTDEPTID: 1,
    PHOTO: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    USERID: 103,
    NAME: "Carol Williams",
    BADGENUMBER: "EMP003",
    DEFAULTDEPTID: 2,
    PHOTO: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    USERID: 104,
    NAME: "David Brown",
    BADGENUMBER: "EMP004",
    DEFAULTDEPTID: 3,
    PHOTO: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }
];

export const mockDepartments: Department[] = [
  { DEPTID: 1, DEPTNAME: "Engineering" },
  { DEPTID: 2, DEPTNAME: "Sales" },
  { DEPTID: 3, DEPTNAME: "Human Resources" },
  { DEPTID: 4, DEPTNAME: "Marketing" }
];

export const mockSchClass: SchClass[] = [
  { schClassid: 1, schName: "Normal Shift (8AM-5PM)" },
  { schClassid: 2, schName: "Morning Shift (6AM-3PM)" },
  { schClassid: 3, schName: "Evening Shift (2PM-11PM)" },
  { schClassid: 4, schName: "Night Shift (10PM-7AM)" }
];

export const mockCheckinout: CheckinoutLog[] = [
  // USERID 101 (Alice Smith) - Current month data
  { USERID: 101, CHECKTIME: '2025-01-28T08:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Start of day' },
  { USERID: 101, CHECKTIME: '2025-01-28T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'End of day' },
  { USERID: 101, CHECKTIME: '2025-01-29T08:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 101, CHECKTIME: '2025-01-29T17:45:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
  { USERID: 101, CHECKTIME: '2025-01-30T09:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 101, CHECKTIME: '2025-01-30T18:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
  { USERID: 101, CHECKTIME: '2025-01-31T08:05:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Early start' },
  { USERID: 101, CHECKTIME: '2025-01-31T12:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'Lunch out' },
  { USERID: 101, CHECKTIME: '2025-01-31T13:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Lunch in' },
  { USERID: 101, CHECKTIME: '2025-01-31T17:10:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'End of day' },

  // USERID 102 (Bob Johnson) - Mixed data
  { USERID: 102, CHECKTIME: '2025-01-28T08:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 102, CHECKTIME: '2025-01-28T17:15:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
  { USERID: 102, CHECKTIME: '2025-01-29T08:45:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 102, CHECKTIME: '2025-01-29T17:30:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

  // USERID 103 (Carol Williams) - Sales department
  { USERID: 103, CHECKTIME: '2025-01-28T09:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 103, CHECKTIME: '2025-01-28T18:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
  { USERID: 103, CHECKTIME: '2025-01-29T08:45:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 103, CHECKTIME: '2025-01-29T17:45:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

  // USERID 104 (David Brown) - HR department
  { USERID: 104, CHECKTIME: '2025-01-28T08:15:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 104, CHECKTIME: '2025-01-28T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
  { USERID: 104, CHECKTIME: '2025-01-29T08:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
  { USERID: 104, CHECKTIME: '2025-01-29T17:15:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 }
];
