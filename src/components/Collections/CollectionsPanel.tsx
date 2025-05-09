import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ApiRequest, Collection } from '../../types';
import { Folder, FolderPlus, Download, Upload, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { exportCollections } from '../../utils/storage';

interface CollectionsPanelProps {
  onSelectRequest: (request: ApiRequest) => void;
}

const CollectionsPanel: React.FC<CollectionsPanelProps> = ({ onSelectRequest }) => {
  const { state, dispatch } = useAppContext();
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState<string>('');

  const toggleCollection = (id: string) => {
    setExpandedCollections({
      ...expandedCollections,
      [id]: !expandedCollections[id],
    });
  };

  const startEditing = (collection: Collection) => {
    setEditingCollection(collection.id);
    setNewCollectionName(collection.name);
  };

  const saveCollectionName = (id: string) => {
    if (newCollectionName.trim()) {
      dispatch({
        type: 'RENAME_COLLECTION',
        payload: { id, name: newCollectionName },
      });
    }
    setEditingCollection(null);
  };

  const deleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      dispatch({
        type: 'DELETE_COLLECTION',
        payload: { id },
      });
    }
  };

  const deleteRequest = (collectionId: string, requestId: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      dispatch({
        type: 'DELETE_REQUEST',
        payload: { collectionId, requestId },
      });
    }
  };

  const createNewCollection = () => {
    const name = prompt('Enter collection name:');
    if (name) {
      dispatch({
        type: 'ADD_COLLECTION',
        payload: { name },
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const collections = JSON.parse(content);
        dispatch({ type: 'IMPORT_COLLECTIONS', payload: collections });
      } catch (error) {
        alert('Failed to import collections: Invalid format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    exportCollections(state.collections);
  };

  const handleSelectRequest = (request: ApiRequest) => {
    // Check if a tab with this request already exists
    const existingTab = state.tabs.find(tab => tab.request.id === request.id);
    if (existingTab) {
      // If it exists, just switch to that tab
      dispatch({ type: 'SET_ACTIVE_TAB', payload: existingTab.id });
    } else {
      // If it doesn't exist, create a new tab with a copy of the request
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
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-300 p-2 dark:border-gray-600">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Collections</h2>
        
        <div className="flex space-x-1">
          <button
            onClick={createNewCollection}
            className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="Create Collection"
          >
            <FolderPlus size={16} />
          </button>
          
          <button
            onClick={handleExport}
            className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="Export Collections"
          >
            <Download size={16} />
          </button>
          
          <label className="cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200" title="Import Collections">
            <Upload size={16} />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {state.collections.length === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <Folder className="mx-auto mb-2 h-8 w-8" />
            <p>No collections yet</p>
            <button
              onClick={createNewCollection}
              className="mt-2 text-accent hover:opacity-80"
            >
              Create your first collection
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {state.collections.map((collection) => (
              <div key={collection.id} className="rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between bg-gray-50 p-2 dark:bg-gray-800">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() => toggleCollection(collection.id)}
                  >
                    {expandedCollections[collection.id] ? (
                      <ChevronDown size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
                    )}
                    
                    <Folder size={16} className="mr-2 text-accent" />
                    
                    {editingCollection === collection.id ? (
                      <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onBlur={() => saveCollectionName(collection.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveCollectionName(collection.id)}
                        className="w-full rounded border border-gray-300 px-1 py-0 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {collection.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditing(collection)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    
                    <button
                      onClick={() => deleteCollection(collection.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {expandedCollections[collection.id] && (
                  <div className="p-2">
                    {collection.requests.length === 0 ? (
                      <p className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                        No requests in this collection
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {collection.requests.map((request) => (
                          <div
                            key={request.id}
                            className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div 
                              className="flex-1 truncate"
                              onClick={() => handleSelectRequest(request)}
                            >
                              <span className={`mr-2 text-xs font-medium ${
                                request.method === 'GET' ? 'text-green-600 dark:text-green-400' :
                                request.method === 'POST' ? 'text-accent' :
                                request.method === 'PUT' ? 'text-amber-600 dark:text-amber-400' :
                                request.method === 'DELETE' ? 'text-red-600 dark:text-red-400' :
                                'text-gray-600 dark:text-gray-400'
                              }`}>
                                {request.method}
                              </span>
                              <span className="text-xs text-gray-800 dark:text-gray-200">
                                {request.name}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => deleteRequest(collection.id, request.id)}
                              className="rounded p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPanel;