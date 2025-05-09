import React from 'react';

interface RequestTabsProps {
  activeTab: 'params' | 'headers' | 'body';
  onChange: (tab: 'params' | 'headers' | 'body') => void;
}

const RequestTabs: React.FC<RequestTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'params' as const, label: 'Params' },
    { id: 'headers' as const, label: 'Headers' },
    { id: 'body' as const, label: 'Body' },
  ];

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default RequestTabs;