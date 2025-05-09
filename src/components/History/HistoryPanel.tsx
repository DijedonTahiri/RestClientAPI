import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ApiRequest } from '../../types';
import { History, Trash2, Clock } from 'lucide-react';

interface HistoryPanelProps {
  onSelectRequest: (request: ApiRequest) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelectRequest }) => {
  const { state, dispatch } = useAppContext();
  
  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the request history?')) {
      dispatch({ type: 'CLEAR_HISTORY' });
    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    // Create a new request object with a new ID to avoid conflicts
    const newRequest = {
      ...request,
      id: crypto.randomUUID(),
    };
    onSelectRequest(newRequest);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-300 p-2 dark:border-gray-600">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">History</h2>
        
        {state.history.length > 0 && (
          <button
            onClick={clearHistory}
            className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {state.history.length === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mx-auto mb-2 h-8 w-8" />
            <p>No request history yet</p>
            <p className="mt-1 text-xs">Your recent requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {state.history.map((request) => (
              <div
                key={request.id}
                onClick={() => handleSelectRequest(request)}
                className="flex cursor-pointer flex-col rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <span className={`mr-2 text-xs font-medium ${
                    request.method === 'GET' ? 'text-green-600 dark:text-green-400' :
                    request.method === 'POST' ? 'text-blue-600 dark:text-blue-400' :
                    request.method === 'PUT' ? 'text-amber-600 dark:text-amber-400' :
                    request.method === 'DELETE' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {request.method}
                  </span>
                  
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                      {request.name || request.url}
                    </div>
                  </div>

                  {request.status !== undefined && (
                    <span className={`ml-2 text-xs font-medium ${
                      request.status >= 200 && request.status < 300 ? 'text-green-600 dark:text-green-400' :
                      request.status >= 300 && request.status < 400 ? 'text-blue-600 dark:text-blue-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {request.status}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="truncate">{request.url}</div>
                  {request.timestamp && (
                    <>
                      <span className="mx-1">•</span>
                      <div>{formatTime(request.timestamp)}</div>
                    </>
                  )}
                  {request.time && (
                    <>
                      <span className="mx-1">•</span>
                      <div>{request.time}ms</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;