import React from 'react';
import { History, FolderArchive } from 'lucide-react';
import CollectionsPanel from '../Collections/CollectionsPanel';
import HistoryPanel from '../History/HistoryPanel';
import { ApiRequest } from '../../types';

interface SidebarProps {
  activeTab: 'collections' | 'history';
  onTabChange: (tab: 'collections' | 'history') => void;
  onSelectRequest: (request: ApiRequest) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onSelectRequest 
}) => {
  return (
    <div className="flex h-full flex-col border-r border-gray-300 dark:border-gray-600">
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={() => onTabChange('collections')}
          className={`flex flex-1 items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'collections'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FolderArchive size={16} className="mr-2" />
          Collections
        </button>
        
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-1 items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <History size={16} className="mr-2" />
          History
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'collections' ? (
          <CollectionsPanel onSelectRequest={onSelectRequest} />
        ) : (
          <HistoryPanel onSelectRequest={onSelectRequest} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;