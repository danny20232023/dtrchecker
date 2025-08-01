
export interface User {
  USERID: number;
  NAME: string;
  BADGENUMBER: string;
  DEFAULTDEPTID: number;
  PHOTO?: string;
}

export interface CheckinoutLog {
  USERID: number;
  CHECKTIME: string;
  CHECKTYPE: 'I' | 'O';
  VERIFYCODE: number;
  Memoinfo?: string;
}

export interface Department {
  DEPTID: number;
  DEPTNAME: string;
}

export interface SchClass {
  schClassid: number;
  schName: string;
}

export interface DailyLog {
  date: string;
  checkin1: string;
  checkin2: string;
  checkin3: string;
  checkin4: string;
  remarks: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userId: string, badgeNumber: string) => Promise<{ success: boolean; message?: string; user?: User; fallback?: boolean }>;
  logout: () => void;
  loading: boolean;
}
