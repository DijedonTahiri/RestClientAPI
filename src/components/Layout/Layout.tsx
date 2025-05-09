import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import TabBar from '../Tabs/TabBar';
import RequestForm from '../RequestPanel/RequestForm';
import ResponseViewer from '../ResponsePanel/ResponseViewer';
import { ApiRequest, ApiResponse } from '../../types';
import { Maximize2, Minimize2 } from 'lucide-react';

const Layout: React.FC = () => {
  const { state, dispatch, createRequest } = useAppContext();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    const isMobile = window.innerWidth < 768;
    return state.settings.sidebarState === 'expanded' && !isMobile;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'collections' | 'history'>('collections');

  useEffect(() => {
    if (state.tabs.length === 0) {
      const request = createRequest();
      dispatch({
        type: 'ADD_TAB',
        payload: {
          id: request.id,
          title: 'Untitled',
          request,
          isDirty: false,
        },
      });
    }
  }, [state.tabs.length, dispatch, createRequest]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarVisible(state.settings.sidebarState === 'expanded' && !isMobileView);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.settings.sidebarState]);

  const handleSelectRequest = (request: ApiRequest) => {
    const existingTab = state.tabs.find(tab => 
      tab.request.url === request.url && 
      tab.request.method === request.method &&
      !tab.isDirty
    );

    if (existingTab) {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: existingTab.id });
    } else {
      const newRequest = { ...request, id: crypto.randomUUID() };
      dispatch({
        type: 'ADD_TAB',
        payload: {
          id: newRequest.id,
          title: request.name || 'Untitled',
          request: newRequest,
          isDirty: false,
        },
      });
    }

    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const activeTabData = state.tabs.find(tab => tab.id === state.activeTabId);
  const currentRequest = activeTabData?.request || createRequest();

  return (
    <div className="flex h-screen flex-col">
      <Header onSelectRequest={handleSelectRequest} />
      
      <div className="relative flex flex-1 overflow-hidden">
        {sidebarVisible && (
          <div className={`h-full ${isMobile ? 'absolute inset-y-0 left-0 z-10 w-full sm:w-64 bg-white dark:bg-gray-900' : 'w-64'}`}>
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelectRequest={handleSelectRequest}
            />
          </div>
        )}
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <TabBar />
          
          <div className="flex flex-1 flex-col overflow-hidden p-4 md:flex-row md:space-x-4">
            <div className="mb-4 md:mb-0 md:w-1/2 md:overflow-y-auto">
              <RequestForm
                request={currentRequest}
                onChange={(request) => {
                  if (activeTabData) {
                    dispatch({
                      type: 'UPDATE_TAB',
                      payload: {
                        id: activeTabData.id,
                        updates: {
                          request,
                          isDirty: true,
                        },
                      },
                    });
                  }
                }}
                onResponse={setResponse}
              />
            </div>
            
            <div className="md:w-1/2 md:overflow-y-auto">
              <ResponseViewer response={response} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-8 items-center border-t border-gray-200 px-2 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        >
          {sidebarVisible ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
};

export default Layout;