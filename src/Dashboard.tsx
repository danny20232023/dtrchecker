
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { PrintPreview } from './PrintPreview';
import { mockDepartments, mockSchClass, mockCheckinout } from './mockData';
import { toDateString, parseTime } from './helpers';
import { DailyLog, CheckinoutLog } from './types';

const BASE_API_URL = '/api';

type FilterType = 'today' | 'last2weeks' | 'thisMonth' | 'lastMonth';

interface PrintModalProps {
  show: boolean;
  onClose: () => void;
  onPrint: (month: FilterType) => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ show, onClose, onPrint }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-auto transform scale-100 animate-fade-in">
        <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Select Print Range</h4>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => onPrint('thisMonth')}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Print Current Month Logs
          </button>
          <button
            onClick={() => onPrint('lastMonth')}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Print Last Month Logs
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('thisMonth');
  const [isCategorizedView, setIsCategorizedView] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [logsForPrint, setLogsForPrint] = useState<DailyLog[]>([]);
  const [printTitle, setPrintTitle] = useState('');
  const [apiError, setApiError] = useState(false);
  const [pendingPrintMonth, setPendingPrintMonth] = useState<FilterType | null>(null);

  const getDateRange = (filter: FilterType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (filter) {
      case 'today':
        break;
      case 'last2weeks':
        startDate.setDate(today.getDate() - 13);
        break;
      case 'thisMonth':
        startDate.setDate(1);
        break;
      case 'lastMonth':
        startDate.setMonth(today.getMonth() - 1);
        startDate.setDate(1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        startDate.setDate(1);
        break;
    }
    return { startDate, endDate };
  };

  useEffect(() => {
    if (user) {
      setLoadingLogs(true);
      setApiError(false);

      const { startDate, endDate } = getDateRange(selectedFilter);

      let currentPrintTitle = '';
      if (selectedFilter === 'thisMonth') {
        currentPrintTitle = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      } else if (selectedFilter === 'lastMonth') {
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        currentPrintTitle = lastMonthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      } else if (selectedFilter === 'today') {
        currentPrintTitle = 'Today';
      } else if (selectedFilter === 'last2weeks') {
        currentPrintTitle = 'Last 2 Weeks';
      }
      setPrintTitle(currentPrintTitle);

      const fetchLogs = async (): Promise<CheckinoutLog[]> => {
        try {
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          const response = await fetch(`${BASE_API_URL}?path=/api/checkinout/${user.USERID}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Failed to fetch logs from API:", error);
          setApiError(true);
          return mockCheckinout.filter(log => log.USERID === user.USERID);
        }
      };

      fetchLogs().then(userRawLogs => {
        const allDatesInRange: string[] = [];
        let currentDateIterator = new Date(startDate);
        while (currentDateIterator <= endDate) {
          allDatesInRange.push(toDateString(currentDateIterator));
          currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }

        const groupedLogs: Record<string, CheckinoutLog[]> = userRawLogs.reduce((acc, log) => {
          const date = toDateString(new Date(log.CHECKTIME));
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(log);
          return acc;
        }, {} as Record<string, CheckinoutLog[]>);

        const processedDailyLogs = allDatesInRange.map(date => {
          const dailyEntries = groupedLogs[date] || [];
          dailyEntries.sort((a, b) => new Date(a.CHECKTIME).getTime() - new Date(b.CHECKTIME).getTime());

          let displayTimes: string[] = [];
          let remarks = dailyEntries.filter(log => log.Memoinfo).map(log => log.Memoinfo).join('; ') || '';

          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay();

          if (dayOfWeek === 6) {
            if (remarks === 'N/A' || !remarks) {
              remarks = 'Saturday';
            } else if (!remarks.includes('Saturday')) {
              remarks = `Saturday; ${remarks}`;
            }
          } else if (dayOfWeek === 0) {
            if (remarks === 'N/A' || !remarks) {
              remarks = 'Sunday';
            } else if (!remarks.includes('Sunday')) {
              remarks = `Sunday; ${remarks}`;
            }
          }

          if (isCategorizedView) {
            let morningIn = '-';
            let morningOut = '-';
            let afternoonIn = '-';
            let afternoonOut = '-';

            const isWithinWindow = (logTime: Date, windowType: string): boolean => {
              const logTotalMinutes = logTime.getHours() * 60 + logTime.getMinutes();
              let lowerBoundMinutes: number, upperBoundMinutes: number;

              switch (windowType) {
                case 'morningIn':
                  lowerBoundMinutes = parseTime('06:00:00').getHours() * 60;
                  upperBoundMinutes = parseTime('10:00:00').getHours() * 60 + 59;
                  break;
                case 'morningOut':
                  lowerBoundMinutes = parseTime('10:00:00').getHours() * 60;
                  upperBoundMinutes = parseTime('14:00:00').getHours() * 60 + 59;
                  break;
                case 'afternoonIn':
                  lowerBoundMinutes = parseTime('11:00:00').getHours() * 60;
                  upperBoundMinutes = parseTime('15:00:00').getHours() * 60 + 59;
                  break;
                case 'afternoonOut':
                  lowerBoundMinutes = parseTime('15:00:00').getHours() * 60;
                  upperBoundMinutes = parseTime('19:00:00').getHours() * 60 + 59;
                  break;
                default:
                  return false;
              }
              return logTotalMinutes >= lowerBoundMinutes && logTotalMinutes <= upperBoundMinutes;
            };

            const usedLogIndices = new Set<number>();

            dailyEntries.forEach((log, index) => {
              if (usedLogIndices.has(index)) return;

              const logTime = new Date(log.CHECKTIME);
              const formattedTime = logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

              if (log.CHECKTYPE === 'I') {
                if (morningIn === '-' && isWithinWindow(logTime, 'morningIn')) {
                  morningIn = formattedTime;
                  usedLogIndices.add(index);
                } else if (afternoonIn === '-' && isWithinWindow(logTime, 'afternoonIn')) {
                  afternoonIn = formattedTime;
                  usedLogIndices.add(index);
                }
              } else if (log.CHECKTYPE === 'O') {
                if (morningOut === '-' && isWithinWindow(logTime, 'morningOut')) {
                  morningOut = formattedTime;
                  usedLogIndices.add(index);
                } else if (afternoonOut === '-' && isWithinWindow(logTime, 'afternoonOut')) {
                  afternoonOut = formattedTime;
                  usedLogIndices.add(index);
                }
              }
            });

            const unassignedEntries = dailyEntries.filter((_, index) => !usedLogIndices.has(index));
            let unassignedIndex = 0;

            if (morningIn === '-' && unassignedEntries[unassignedIndex]) {
              morningIn = new Date(unassignedEntries[unassignedIndex++].CHECKTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            if (morningOut === '-' && unassignedEntries[unassignedIndex]) {
              morningOut = new Date(unassignedEntries[unassignedIndex++].CHECKTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            if (afternoonIn === '-' && unassignedEntries[unassignedIndex]) {
              afternoonIn = new Date(unassignedEntries[unassignedIndex++].CHECKTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            if (afternoonOut === '-' && unassignedEntries[unassignedIndex]) {
              afternoonOut = new Date(unassignedEntries[unassignedIndex++].CHECKTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }

            displayTimes = [morningIn, morningOut, afternoonIn, afternoonOut];
          } else {
            let amLogs: string[] = [];
            let pmLogs: string[] = [];

            dailyEntries.forEach(log => {
              const logTime = new Date(log.CHECKTIME);
              const formattedTime = logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
              const hour = logTime.getHours();

              if (hour < 12) {
                amLogs.push(formattedTime);
              } else {
                pmLogs.push(formattedTime);
              }
            });

            displayTimes = [
              amLogs.length > 0 ? amLogs.join(', ') : '-',
              pmLogs.length > 0 ? pmLogs.join(', ') : '-',
              '-',
              '-'
            ];

            const defaultShift = mockSchClass.find(s => s.schClassid === 1);
            if (defaultShift) {
              remarks = `Shift: ${defaultShift.schName}` + (remarks ? `; ${remarks}` : '');
            }
          }

          if (!remarks) {
            remarks = 'N/A';
          }

          return {
            date: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            checkin1: displayTimes[0],
            checkin2: displayTimes[1],
            checkin3: displayTimes[2],
            checkin4: displayTimes[3],
            remarks: remarks,
          };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setDailyLogs(processedDailyLogs);
        setLoadingLogs(false);

        if (pendingPrintMonth === selectedFilter) {
          setLogsForPrint(processedDailyLogs);
          setShowPrintPreview(true);
          setPendingPrintMonth(null);
        }
      });
    }
  }, [user, selectedFilter, isCategorizedView, pendingPrintMonth]);

  if (!user) {
    return <p className="text-center text-red-500 mt-10">Please log in to view your DTR logs.</p>;
  }

  const filterButtonClass = (filterName: FilterType) =>
    `py-2 px-4 rounded-full text-sm font-medium transition duration-150 ease-in-out shadow-md ${
      selectedFilter === filterName
        ? 'bg-indigo-600 text-white transform scale-105'
        : 'bg-indigo-50/10 text-indigo-700 hover:bg-indigo-50/20'
    }`;

  const handlePrintSelection = (month: FilterType) => {
    setShowPrintModal(false);
    setPendingPrintMonth(month);
    setSelectedFilter(month);
  };

  if (showPrintPreview) {
    return (
      <PrintPreview
        logs={logsForPrint}
        monthTitle={printTitle}
        isCategorizedView={isCategorizedView}
        onClose={() => {
          setShowPrintPreview(false);
          setPrintTitle('');
          setLogsForPrint([]);
        }}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 p-6 bg-indigo-100/70 rounded-xl shadow-lg border border-indigo-200">
          <div className="flex items-center space-x-4">
            {user.PHOTO && (
              <img
                src={user.PHOTO}
                alt={`${user.NAME}'s photo`}
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-indigo-300"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://placehold.co/60x60/CCCCCC/000000?text=N/A"; 
                }}
              />
            )}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-800">
                Welcome, {user.NAME}!
              </h2>
              <p className="text-gray-700 text-sm sm:text-base">
                Badge: {user.BADGENUMBER} | Dept: {mockDepartments.find(d => d.DEPTID === user.DEFAULTDEPTID)?.DEPTNAME || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Attendance Check-in/out Checker</h3>

        <div className="mb-6 flex flex-col lg:flex-row lg:justify-between items-center gap-4 p-4 bg-indigo-50/50 rounded-lg shadow-inner">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <button
              onClick={() => setSelectedFilter('today')}
              className={filterButtonClass('today')}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedFilter('last2weeks')}
              className={filterButtonClass('last2weeks')}
            >
              Last 2 Weeks
            </button>
            <button
              onClick={() => setSelectedFilter('thisMonth')}
              className={filterButtonClass('thisMonth')}
            >
              This Month
            </button>
            <button
              onClick={() => setSelectedFilter('lastMonth')}
              className={filterButtonClass('lastMonth')}
            >
              Last Month
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-end space-x-3 mt-4 lg:mt-0">
            <span className="text-base font-medium text-gray-700">View Mode:</span>
            <button
              onClick={() => setIsCategorizedView(true)}
              className={`py-2 px-5 rounded-full text-sm font-semibold transition duration-150 ease-in-out shadow-md ${
                isCategorizedView
                  ? 'bg-blue-600 text-white transform scale-105'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Shift Schedule
            </button>
            <button
              onClick={() => setIsCategorizedView(false)}
              className={`py-2 px-5 rounded-full text-sm font-semibold transition duration-150 ease-in-out shadow-md ${
                !isCategorizedView
                  ? 'bg-blue-600 text-white transform scale-105'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Raw Logs
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
              title="Print Logs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                <path d="M720-480v-240H240v240h-80v-320h640v320h-80Zm-480 80h480v-160H240v160Zm-80 240v-80h640v80H160Zm0-560v-80h640v80H160Zm80 240v-80h480v80H240Zm480 240v-80h80v80h-80Zm-560 0v-80h80v80h-80Zm480-240H240h480ZM240-320v-160v160Z"/>
              </svg>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">API Connection Error!</strong>
            <span className="block sm:inline ml-2">Could not connect to the backend database. Displaying mock data.</span>
          </div>
        )}

        {loadingLogs ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-lg text-gray-600">Loading logs...</span>
          </div>
        ) : dailyLogs.length === 0 ? (
          <p className="text-center text-gray-600 py-10 text-lg">No daily check-in/out records found for your account within the selected date range.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Calendar Date
                  </th>
                  {isCategorizedView ? (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Morning In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Morning Out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Afternoon In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Afternoon Out
                      </th>
                    </>
                  ) : (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        AM Logs
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        PM Logs
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dailyLogs.map((day, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-indigo-50 transition-colors duration-150'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {day.checkin1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {day.checkin2}
                    </td>
                    {isCategorizedView && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {day.checkin3}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {day.checkin4}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {day.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <PrintModal
        show={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onPrint={handlePrintSelection}
      />
    </div>
  );
};
