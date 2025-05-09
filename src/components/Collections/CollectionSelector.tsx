import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Plus, FolderPlus } from 'lucide-react';

interface CollectionSelectorProps {
  onSelect: (collectionId: string) => void;
  onCancel: () => void;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({ onSelect, onCancel }) => {
  const { state, dispatch } = useAppContext();
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  // Handle creating a new collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    
    dispatch({
      type: 'ADD_COLLECTION',
      payload: { name: newCollectionName },
    });
    
    setNewCollectionName('');
    setShowNewCollection(false);
  };

  return (
    <div className="space-y-4">
      {!showNewCollection ? (
        <>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select Collection
          </h3>
          
          {state.collections.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {state.collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onSelect(collection.id)}
                  className="w-full text-left rounded p-2 hover:bg-gray-100 text-sm dark:hover:bg-gray-700 flex items-center"
                >
                  <FolderPlus size={16} className="mr-2 text-blue-500" />
                  {collection.name} 
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({collection.requests.length})
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No collections found. Create one below.
            </p>
          )}
          
          <button
            onClick={() => setShowNewCollection(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Plus size={14} className="mr-1" />
            Create new collection
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            New Collection
          </h3>
          
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection name"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            autoFocus
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
              className={`rounded px-3 py-1 text-xs font-medium text-white ${
                !newCollectionName.trim()
                  ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              Create
            </button>
            
            <button
              onClick={() => setShowNewCollection(false)}
              className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CollectionSelector;