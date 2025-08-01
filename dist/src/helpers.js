    // Helper function to normalize date to YYYY-MM-DD string
    export const toDateString = (date) => date.toISOString().split('T')[0];

    // Helper to parse time strings (HH:MM:SS) into Date objects for comparison
    export const parseTime = (timeStr) => {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      const date = new Date(); // Use a dummy date, only time matters
      date.setHours(hours, minutes, seconds, 0);
      return date;
    };
    