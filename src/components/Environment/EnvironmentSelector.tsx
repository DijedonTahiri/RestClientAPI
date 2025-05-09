import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Globe, Settings2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import EnvironmentManager from './EnvironmentManager';

const EnvironmentSelector: React.FC = () => {
  const { state } = useAppContext();
  const environments = state.settings.environments || [];
  const activeEnv = environments.find(env => env.isActive);
  const [showManager, setShowManager] = React.useState(false);

  return (
    <>
      <button 
        onClick={() => setShowManager(true)}
        className="group flex items-center space-x-2 rounded-lg    px-3 py-3 text-sm hover:border-accent/50 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Select environment"
      >
        <Globe size={14} className="text-gray-500 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">
          {activeEnv?.name || 'No Environment'}
        </span>
        {activeEnv && (
          <div className="flex items-center space-x-2">
            <span className="h-1 w-1 rounded-full bg-green-500" />
            <Settings2 
              size={14} 
              className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500" 
            />
          </div>
        )}
        {!activeEnv && (
          <Settings2 
            size={14} 
            className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500" 
          />
        )}
      </button>

      <Dialog.Root open={showManager} onOpenChange={setShowManager}>
        <EnvironmentManager open={showManager} onOpenChange={setShowManager} />
      </Dialog.Root>
    </>
  );
};

export default EnvironmentSelector;