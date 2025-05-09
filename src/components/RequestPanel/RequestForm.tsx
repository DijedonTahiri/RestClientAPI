import React, { useState, useEffect } from 'react';
import { ApiRequest, HttpMethod } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { sendRequest } from '../../utils/api';
import KeyValueEditor from './KeyValueEditor';
import RequestTabs from './RequestTabs';
import { Save, Send } from 'lucide-react';
import CollectionSelector from '../Collections/CollectionSelector';
import { useHotkeys } from 'react-hotkeys-hook';
import * as Tooltip from '@radix-ui/react-tooltip';

interface RequestFormProps {
  request: ApiRequest;
  onChange: (request: ApiRequest) => void;
  onResponse: (response: any) => void;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];

const RequestForm: React.FC<RequestFormProps> = ({ request, onChange, onResponse }) => {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { dispatch, createKeyValuePair } = useAppContext();

  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    setShowSaveModal(true);
  }, []);

  useHotkeys('ctrl+enter, cmd+enter', (e) => {
    e.preventDefault();
    handleSendRequest();
  }, [request]);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRequest = {
      ...request,
      method: e.target.value as HttpMethod,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          isDirty: true,
        },
      },
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRequest = {
      ...request,
      url: e.target.value,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          isDirty: true,
        },
      },
    });
  };

  const handleParamsChange = (params: typeof request.params) => {
    const newRequest = {
      ...request,
      params,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          isDirty: true,
        },
      },
    });
  };

  const handleHeadersChange = (headers: typeof request.headers) => {
    const newRequest = {
      ...request,
      headers,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          isDirty: true,
        },
      },
    });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRequest = {
      ...request,
      body: e.target.value,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          isDirty: true,
        },
      },
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRequest = {
      ...request,
      name: e.target.value,
    };
    onChange(newRequest);
    dispatch({
      type: 'UPDATE_TAB',
      payload: {
        id: request.id,
        updates: {
          request: newRequest,
          title: e.target.value || 'Untitled',
          isDirty: true,
        },
      },
    });
  };

  const handleSendRequest = async () => {
    if (!request.url) return;
    
    setIsLoading(true);
    
    try {
      const response = await sendRequest(request);
      onResponse(response);
      dispatch({ type: 'ADD_TO_HISTORY', payload: request });
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = (collectionId: string) => {
    dispatch({
      type: 'SAVE_REQUEST',
      payload: { collectionId, request },
    });
    setShowSaveModal(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <select
          value={request.method}
          onChange={handleMethodChange}
          className="w-24 rounded border border-gray-300 bg-white px-2 py-2 text-sm font-medium focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        >
          {HTTP_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          value={request.url}
          onChange={handleUrlChange}
          placeholder="Enter request URL"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={!request.url || isLoading}
                className={`flex items-center justify-center rounded px-4 py-2 text-sm font-medium text-white transition-colors ${
                  !request.url || isLoading
                    ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                    : 'bg-accent hover:opacity-90'
                }`}
              >
                {isLoading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <Send size={14} className="mr-1" /> Send
                  </>
                )}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
              sideOffset={5}
            >
              Send request (Ctrl+Enter)
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="flex items-center justify-center rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Save size={14} className="mr-1" /> Save
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              className="rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700"
              sideOffset={5}
            >
              Save request (Ctrl+S)
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
      
      {showSaveModal && (
        <div className="rounded border border-gray-300 p-4 dark:border-gray-600">
          <div className="mb-4">
            <label htmlFor="request-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Request Name:
            </label>
            <input
              id="request-name"
              type="text"
              value={request.name}
              onChange={handleNameChange}
              placeholder="My Request"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          
          <CollectionSelector onSelect={handleSaveRequest} onCancel={() => setShowSaveModal(false)} />
        </div>
      )}
      
      <RequestTabs activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="rounded border border-gray-300 p-4 dark:border-gray-600">
        {activeTab === 'params' && (
          <KeyValueEditor
            items={request.params}
            onChange={handleParamsChange}
            name="Query Parameters"
            createItem={createKeyValuePair}
          />
        )}
        
        {activeTab === 'headers' && (
          <KeyValueEditor
            items={request.headers}
            onChange={handleHeadersChange}
            name="Headers"
            createItem={createKeyValuePair}
          />
        )}
        
        {activeTab === 'body' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
              Request Body
            </h3>
            <textarea
              value={request.body}
              onChange={handleBodyChange}
              placeholder={`{\n  "key": "value"\n}`}
              rows={8}
              className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              disabled={['GET', 'HEAD'].includes(request.method)}
            />
            {['GET', 'HEAD'].includes(request.method) && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Request body is not applicable for {request.method} requests.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestForm;