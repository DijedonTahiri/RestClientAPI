import React from 'react';
import { FileJson, FileCode, List, Bot } from 'lucide-react';

interface ResponseTabsProps {
  activeTab: 'json' | 'raw' | 'headers' | 'ai';
  onChange: (tab: 'json' | 'raw' | 'headers' | 'ai') => void;
}

const ResponseTabs: React.FC<ResponseTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { 
      id: 'json' as const, 
      label: 'JSON', 
      icon: <FileJson size={14} className="mr-1" /> 
    },
    { 
      id: 'raw' as const, 
      label: 'Raw', 
      icon: <FileCode size={14} className="mr-1" /> 
    },
    { 
      id: 'headers' as const, 
      label: 'Headers', 
      icon: <List size={14} className="mr-1" /> 
    },
    {
      id: 'ai' as const,
      label: 'AI Analysis',
      icon: <Bot size={14} className="mr-1" />
    },
  ];

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ResponseTabs;