import React, { useState, useEffect } from 'react';
import { Moon, Sun, Zap, Rocket, Settings, Activity, Search } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import GetStartedDialog from '../GetStarted/GetStartedDialog';
import WelcomeDialog from '../Welcome/WelcomeDialog';
import { ApiRequest } from '../../types';
import { useNavigate } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import SearchResults from '../Search/SearchResults';

interface HeaderProps {
  onSelectRequest: (request: ApiRequest) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelectRequest }) => {
  const { state, dispatch } = useAppContext();
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Keyboard shortcuts
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setShowSearch(true);
  });

  useHotkeys('esc', () => {
    setShowSearch(false);
  });
  
  const toggleDarkMode = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectRequest = (request: ApiRequest) => {
    onSelectRequest(request);
    setShowSearch(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-600">
        <div className="flex items-center">
          <Zap size={20} className="mr-2 text-accent" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">REST Client</h1>
        </div>
        
        <div className="flex flex-1 items-center justify-center max-w-2xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search requests, collections, and more... (Ctrl+K)"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
            />
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setShowGetStarted(true)}
                  className="flex items-center rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Rocket size={16} className="mr-1.5" />
                  Get Started
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
                  sideOffset={5}
                >
                  Create new request (Ctrl+N)
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => navigate('/monitoring')}
                  className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Activity size={18} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content
                className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
                sideOffset={5}
              >
                API Monitoring (Ctrl+M)
              </Tooltip.Content>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => navigate('/settings')}
                  className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Settings size={18} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content
                className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
                sideOffset={5}
              >
                Settings (Ctrl+,)
              </Tooltip.Content>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content
                className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
                sideOffset={5}
              >
                Toggle theme (Ctrl+T)
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </header>

      <WelcomeDialog
        open={showWelcome}
        onOpenChange={setShowWelcome}
        onGetStarted={() => setShowGetStarted(true)}
      />

      <GetStartedDialog
        open={showGetStarted}
        onOpenChange={setShowGetStarted}
        onSelectRequest={onSelectRequest}
      />

      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed left-1/2 top-24 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search requests, collections, and more..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <SearchResults
                query={searchQuery}
                onClose={handleCloseSearch}
                onSelectRequest={handleSelectRequest}
              />
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>
                  <kbd className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">↑↓</kbd> to navigate
                  <kbd className="ml-2 rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">Enter</kbd> to select
                  <kbd className="ml-2 rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">Esc</kbd> to close
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;