
export const toDateString = (date: Date): string => date.toISOString().split('T')[0];

export const parseTime = (timeStr: string): Date => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};
