import React, { useState } from 'react';
import { ApiResponse } from '../../types';
import { Clipboard, Clock, Database, FileText } from 'lucide-react';
import ResponseTabs from './ResponseTabs';
import JsonView from './JsonView';
import HeadersView from './HeadersView';
import RawView from './RawView';
import AIAnalysisView from './AIAnalysisView';

interface ResponseViewerProps {
  response: ApiResponse | null;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'raw' | 'headers' | 'ai'>('json');
  
  const handleCopyResponse = () => {
    if (!response) return;
    
    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2))
      .then(() => {
        alert('Response copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy response:', err);
      });
  };
  
  if (!response) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
        <Database size={48} className="mb-4 text-gray-400 dark:text-gray-500" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">No Response</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Send a request to see the response here
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className={`mr-2 h-3 w-3 rounded-full ${
              response.status === 0 ? 'bg-gray-500' :
              response.status >= 200 && response.status < 300 ? 'bg-emerald-500' :
              response.status >= 300 && response.status < 400 ? 'bg-blue-500' :
              response.status >= 400 && response.status < 500 ? 'bg-amber-500' :
              'bg-red-500'
            }`}></div>
            <span className="font-mono text-sm font-medium">
              {response.status} {response.statusText}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>{response.time} ms</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FileText size={14} className="mr-1" />
            <span>{Math.round(response.size / 1024 * 100) / 100} KB</span>
          </div>
        </div>
        
        <button
          onClick={handleCopyResponse}
          className="flex items-center rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Clipboard size={12} className="mr-1" />
          Copy
        </button>
      </div>
      
      <ResponseTabs activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="flex-1 overflow-auto rounded border border-gray-300 dark:border-gray-600">
        {activeTab === 'json' && (
          <JsonView data={response.body} />
        )}
        
        {activeTab === 'raw' && (
          <RawView data={response.body} />
        )}
        
        {activeTab === 'headers' && (
          <HeadersView headers={response.headers} />
        )}

        {activeTab === 'ai' && (
          <AIAnalysisView response={response} />
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;