    // This file contains all the mock data used by the DTR Checker application.
    // In a real application, this data would typically be fetched from a backend API
    // connected to a database like MSSQL.

    export const mockDepartments = [
      { DEPTID: 1, DEPTNAME: 'Human Resources', SUPDEPTID: 0 },
      { DEPTID: 2, DEPTNAME: 'Engineering', SUPDEPTID: 0 },
      { DEPTID: 3, DEPTNAME: 'Sales', SUPDEPTID: 0 },
      { DEPTID: 4, DEPTNAME: 'Marketing', SUPDEPTID: 0 },
    ];

    export const mockSchClass = [
      {
        schClassid: 1,
        schName: 'Normal Shift',
        StartTime: '08:00:00', // 8 AM
        EndTime: '17:00:00',   // 5 PM
        CheckInTime1: '08:00:00', // First expected check-in
        CheckOutTime1: '12:00:00', // First expected check-out (lunch)
        CheckInTime2: '13:00:00', // Second expected check-in (after lunch)
        CheckOutTime2: '17:00:00', // Second expected check-out (end of day)
        LateMinutes: 15,
        EarlyMinutes: 15,
        CheckIn: 1,
        CheckOut: 1,
        Color: 16715535,
        AutoBind: 1,
        WorkDay: 1,
        SensorID: null,
        WorkMins: 480 // 8 hours * 60 minutes
      },
      {
        schClassid: 2,
        schName: 'Night Shift',
        StartTime: '22:00:00', // 10 PM
        EndTime: '07:00:00',   // 7 AM (next day)
        CheckInTime1: '22:00:00',
        CheckOutTime1: '02:00:00', // Mid-shift break
        CheckInTime2: '03:00:00',
        CheckOutTime2: '07:00:00',
        LateMinutes: 15,
        EarlyMinutes: 15,
        CheckIn: 1, CheckOut: 1, Color: 123456, AutoBind: 1, WorkDay: 1, SensorID: null, WorkMins: 480
      }
    ];

    export const mockUsers = [
      { USERID: 101, BADGENUMBER: 'EMP001', NAME: 'Alice Smith', PASSWORD: 'password123', DEFAULTDEPTID: 2, PHOTO: 'https://placehold.co/60x60/ADD8E6/000000?text=AS' }, // Engineering
      { USERID: 102, BADGENUMBER: 'EMP002', NAME: 'Bob Johnson', PASSWORD: 'securepass', DEFAULTDEPTID: 2, PHOTO: 'https://placehold.co/60x60/90EE90/000000?text=BJ' }, // Engineering
      { USERID: 103, BADGENUMBER: 'EMP003', NAME: 'Charlie Brown', PASSWORD: 'mysecret', DEFAULTDEPTID: 3, PHOTO: 'https://placehold.co/60x60/FFD700/000000?text=CB' }, // Sales
      { USERID: 104, BADGENUMBER: 'EMP004', NAME: 'Diana Prince', PASSWORD: 'wonderwoman', DEFAULTDEPTID: 1, PHOTO: 'https://placehold.co/60x60/FFB6C1/000000?text=DP' }, // Human Resources
    ];

    export const mockCheckinout = [
      // --- USERID 101 (Alice Smith) - July Data (Normal Shift) ---
      // More than 4 entries for July 28, 2025 to test uncategorized view
      { USERID: 101, CHECKTIME: '2025-07-28T07:50:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Early morning start' },
      { USERID: 101, CHECKTIME: '2025-07-28T12:05:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'Lunch out' },
      { USERID: 101, CHECKTIME: '2025-07-28T12:55:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Lunch in' },
      { USERID: 101, CHECKTIME: '2025-07-28T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'End of shift' },
      { USERID: 101, CHECKTIME: '2025-07-28T17:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Overtime start' }, // 5th entry
      { USERID: 101, CHECKTIME: '2025-07-28T19:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'Overtime end' },   // 6th entry

      { USERID: 101, CHECKTIME: '2025-07-29T08:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Morning check-in' },
      { USERID: 101, CHECKTIME: '2025-07-29T12:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'Lunch break start' },
      { USERID: 101, CHECKTIME: '2025-07-29T13:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Lunch break end' },
      { USERID: 101, CHECKTIME: '2025-07-29T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'End of shift' },

      { USERID: 101, CHECKTIME: '2025-07-30T08:15:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 101, CHECKTIME: '2025-07-30T17:30:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

      // --- USERID 101 (Alice Smith) - June Data (Normal Shift) ---
      { USERID: 101, CHECKTIME: '2025-06-25T08:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Start of day (June)' },
      { USERID: 101, CHECKTIME: '2025-06-25T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'End of day (June)' },
      { USERID: 101, CHECKTIME: '2025-06-26T08:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 101, CHECKTIME: '2025-06-26T17:45:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 101, CHECKTIME: '2025-06-27T09:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 101, CHECKTIME: '2025-06-27T18:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 101, CHECKTIME: '2025-06-28T08:05:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Early June start' },
      { USERID: 101, CHECKTIME: '2025-06-28T12:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'June lunch out' },
      { USERID: 101, CHECKTIME: '2025-06-28T13:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'June lunch in' },
      { USERID: 101, CHECKTIME: '2025-06-28T17:10:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'June end of day' },


      // --- USERID 102 (Bob Johnson) - July Data (Normal Shift) ---
      { USERID: 102, CHECKTIME: '2025-07-29T08:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 102, CHECKTIME: '2025-07-29T17:15:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

      // --- USERID 102 (Bob Johnson) - June Data (Normal Shift) ---
      { USERID: 102, CHECKTIME: '2025-06-20T08:45:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'June 20 check-in' },
      { USERID: 102, CHECKTIME: '2025-06-20T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'June 20 check-out' },
      { USERID: 102, CHECKTIME: '2025-06-21T09:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 102, CHECKTIME: '2025-06-21T16:55:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

      // --- USERID 103 (Charlie Brown) - July Data (Normal Shift) ---
      { USERID: 103, CHECKTIME: '2025-07-29T07:45:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 }, // Early check-in
      { USERID: 103, CHECKTIME: '2025-07-29T12:30:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-07-29T13:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-07-29T16:50:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

      { USERID: 103, CHECKTIME: '2025-07-30T07:55:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-07-30T17:05:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-07-30T20:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Overtime check-in' }, // Extra check-in

      // --- USERID 103 (Charlie Brown) - June Data (Normal Shift) ---
      { USERID: 103, CHECKTIME: '2025-06-18T07:30:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'Early start for project' },
      { USERID: 103, CHECKTIME: '2025-06-18T16:40:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-06-19T08:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-06-19T12:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-06-19T13:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 103, CHECKTIME: '2025-06-19T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },

      // --- USERID 104 (Diana Prince) - July Data (Normal Shift) ---
      { USERID: 104, CHECKTIME: '2025-07-29T09:00:00Z', CHECKTYPE: 'I', VERIFYCODE: 0, Memoinfo: 'HR daily check-in' },
      { USERID: 104, CHECKTIME: '2025-07-29T17:00:00Z', CHECKTYPE: 'O', VERIFYCODE: 0, Memoinfo: 'HR daily check-out' },
      { USERID: 104, CHECKTIME: '2025-07-30T09:10:00Z', CHECKTYPE: 'I', VERIFYCODE: 0 },
      { USERID: 104, CHECKTIME: '2025-07-30T17:20:00Z', CHECKTYPE: 'O', VERIFYCODE: 0 },
    ];
    