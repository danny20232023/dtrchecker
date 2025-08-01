
import React from 'react';
import { DailyLog, User } from './types';
import { mockDepartments } from './mockData';

interface PrintPreviewProps {
  logs: DailyLog[];
  monthTitle: string;
  isCategorizedView: boolean;
  onClose: () => void;
  user: User;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ 
  logs, 
  monthTitle, 
  isCategorizedView, 
  onClose, 
  user 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Print Preview: {monthTitle} Logs
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out text-sm"
            >
              Print Now
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center space-x-4 print:block print:mb-4">
          {user.PHOTO && (
            <img
              src={user.PHOTO}
              alt={`${user.NAME}'s photo`}
              className="w-16 h-16 rounded-full object-cover shadow-md print:w-12 print:h-12 print:rounded-full print:float-left print:mr-4"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/60x60/CCCCCC/000000?text=N/A"; 
              }}
            />
          )}
          <div className="print:overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 print:text-xl print:font-semibold">
              {user.NAME}
            </h2>
            <p className="text-gray-600 print:text-sm">Badge Number: {user.BADGENUMBER}</p>
            <p className="text-gray-600 print:text-sm">
              Department: {mockDepartments.find(d => d.DEPTID === user.DEFAULTDEPTID)?.DEPTNAME || 'N/A'}
            </p>
            <p className="text-gray-600 print:text-sm">Logs for: {monthTitle}</p>
          </div>
        </div>
        <hr className="mb-6 print:hidden" />

        {logs.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No logs to display for printing.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow print:shadow-none">
            <table className="min-w-full divide-y divide-gray-200 print:border print:border-gray-300">
              <thead className="bg-gray-50 print:bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                    Calendar Date
                  </th>
                  {isCategorizedView ? (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        Morning In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        Morning Out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        Afternoon In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        Afternoon Out
                      </th>
                    </>
                  ) : (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        AM Logs
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                        PM Logs
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider print:text-gray-700 print:font-bold">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {logs.map((day, index) => (
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
    </div>
  );
};
