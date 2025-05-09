import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ApiRequest } from '../../types';
import { Settings, History, Activity, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OpenAIConfigDialog from '../AI/OpenAIConfigDialog';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
  onSelectRequest: (request: ApiRequest) => void;
}

type ActionItem = {
  type: 'action';
  id: string;
  label: string;
  description: string;
  Icon: React.ComponentType<any>;
  action: 'settings' | 'monitoring' | 'ai';
};

type RequestItem = {
  type: 'request';
  request: ApiRequest;
};

type ListItem = ActionItem | RequestItem;

const SearchResults: React.FC<SearchResultsProps> = ({ query, onClose, onSelectRequest }) => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [showOpenAIConfig, setShowOpenAIConfig] = useState(false);

  // Quick actions
  const quickActions: ActionItem[] = [
    {
      type: 'action',
      id: 'settings',
      label: 'Settings',
      description: 'Configure application preferences',
      Icon: Settings,
      action: 'settings',
    },
    {
      type: 'action',
      id: 'monitoring',
      label: 'API Monitoring',
      description: 'View API metrics and status',
      Icon: Activity,
      action: 'monitoring',
    },
    {
      type: 'action',
      id: 'ai',
      label: 'Configure AI',
      description: 'Set up OpenAI integration',
      Icon: Bot,
      action: 'ai',
    },
  ];

  // Filter recent requests
  const filteredRequests = state.history.filter(req =>
    req.name?.toLowerCase().includes(query.toLowerCase()) ||
    req.url.toLowerCase().includes(query.toLowerCase()) ||
    req.method.toLowerCase().includes(query.toLowerCase())
  );

  const requestItems: RequestItem[] = filteredRequests.map(req => ({
    type: 'request',
    request: req,
  }));

  // Combined list for navigation
  const items: ListItem[] = [...quickActions, ...requestItems];

  // Keyboard navigation state
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleAction = (action: ActionItem['action']) => {
    onClose();
    setTimeout(() => {
      if (action === 'ai') {
        setShowOpenAIConfig(true);
      } else {
        navigate(action === 'settings' ? '/settings' : '/monitoring');
      }
    }, 0);
  };

  const selectItem = (item: ListItem) => {
    if (item.type === 'action') {
      handleAction(item.action);
    } else {
      onSelectRequest(item.request);
      onClose();
    }
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        selectItem(items[activeIndex]);
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="outline-none"
      >
        {/* Quick Actions Section */}
        <div>
          <div className="mb-2 px-4 text-xs font-medium uppercase text-gray-500">
            Quick Actions
          </div>
          <div className="space-y-1">
            {quickActions.map(action => {
              const idx = items.findIndex(i => i.type === 'action' && i.id === action.id);
              const isActive = idx === activeIndex;
              return (
                <button
                  key={action.id}
                  onClick={() => selectItem(action)}
                  className={`w-full rounded-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <div className="flex items-center">
                    <action.Icon className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Requests Section */}
        {requestItems.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 px-4 text-xs font-medium uppercase text-gray-500">
              Recent Requests
            </div>
            <div className="space-y-1">
              {requestItems.map(item => {
                const idx = items.findIndex(i => i.type === 'request' && i.request.id === item.request.id);
                const isActive = idx === activeIndex;
                const { request } = item;
                const methodColor =
                  request.method === 'GET'
                    ? 'text-green-600 dark:text-green-400'
                    : request.method === 'POST'
                    ? 'text-accent'
                    : request.method === 'PUT'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400';

                return (
                  <button
                    key={request.id}
                    onClick={() => selectItem(item)}
                    className={`w-full rounded-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    <div className="flex items-center">
                      <History className="mr-2 h-4 w-4" />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center">
                          <span className={`mr-2 text-xs font-medium ${methodColor}`}>{request.method}</span>
                          <span className="truncate text-sm">{request.name || request.url}</span>
                        </div>
                        <div className="truncate text-xs text-gray-500">{request.url}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* No Matches */}
        {query && requestItems.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            No matching requests found
          </div>
        )}
      </div>

      {showOpenAIConfig && (
        <OpenAIConfigDialog
          open={showOpenAIConfig}
          onOpenChange={setShowOpenAIConfig}
        />
      )}
    </>
  );
};

export default SearchResults;
