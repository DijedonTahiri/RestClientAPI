import React from 'react';
import { KeyValuePair } from '../../types';
import { Plus, Trash2, Check } from 'lucide-react';

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  name: string;
  createItem: () => KeyValuePair;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ 
  items, 
  onChange, 
  name,
  createItem 
}) => {
  const handleAdd = () => {
    onChange([...items, createItem()]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: 'key' | 'value', value: string) => {
    onChange(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleToggle = (id: string) => {
    onChange(
      items.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
          {name}
        </h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center text-xs text-accent hover:opacity-80"
        >
          <Plus size={14} className="mr-1" />
          Add
        </button>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              className={`flex h-5 w-5 items-center justify-center rounded ${
                item.enabled 
                  ? 'bg-accent hover:opacity-90' 
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
              }`}
              title={item.enabled ? 'Disable' : 'Enable'}
            >
              {item.enabled && <Check size={12} className="text-white" />}
            </button>
            
            <input
              type="text"
              value={item.key}
              onChange={(e) => handleChange(item.id, 'key', e.target.value)}
              placeholder="Key"
              className={`flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 ${
                !item.enabled ? 'opacity-50' : ''
              }`}
              disabled={!item.enabled}
            />
            
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleChange(item.id, 'value', e.target.value)}
              placeholder="Value"
              className={`flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 ${
                !item.enabled ? 'opacity-50' : ''
              }`}
              disabled={!item.enabled}
            />
            
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            No {name.toLowerCase()} added. Click "Add" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyValueEditor;