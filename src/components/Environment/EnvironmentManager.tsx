import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Settings2, Globe, Check } from 'lucide-react';
import { Environment, EnvironmentVariable } from '../../types/environment';
import { useAppContext } from '../../contexts/AppContext';
import { cn } from '../../utils/cn';

interface EnvironmentManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useAppContext();
  const [newEnvName, setNewEnvName] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [newVariable, setNewVariable] = useState<Partial<EnvironmentVariable>>({
    key: '',
    value: '',
    description: '',
  });

  const handleCreateEnvironment = () => {
    if (!newEnvName.trim()) return;

    const newEnvironment: Environment = {
      id: crypto.randomUUID(),
      name: newEnvName,
      variables: [],
      isActive: false,
    };

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        environments: [...(state.settings.environments || []), newEnvironment],
      },
    });

    setNewEnvName('');
    setSelectedEnv(newEnvironment);
  };

  const handleDeleteEnvironment = (envId: string) => {
    if (!confirm('Are you sure you want to delete this environment?')) return;

    const updatedEnvironments = state.settings.environments.filter(env => env.id !== envId);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        environments: updatedEnvironments,
        activeEnvironmentId: undefined,
      },
    });
    setSelectedEnv(null);
  };

  const handleAddVariable = () => {
    if (!selectedEnv || !newVariable.key?.trim()) return;

    const variable: EnvironmentVariable = {
      id: crypto.randomUUID(),
      key: newVariable.key,
      value: newVariable.value || '',
      description: newVariable.description,
    };

    const updatedEnv = {
      ...selectedEnv,
      variables: [...selectedEnv.variables, variable],
    };

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        environments: state.settings.environments.map(env =>
          env.id === selectedEnv.id ? updatedEnv : env
        ),
      },
    });

    setNewVariable({ key: '', value: '', description: '' });
  };

  const handleDeleteVariable = (variableId: string) => {
    if (!selectedEnv) return;

    const updatedEnv = {
      ...selectedEnv,
      variables: selectedEnv.variables.filter(v => v.id !== variableId),
    };

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        environments: state.settings.environments.map(env =>
          env.id === selectedEnv.id ? updatedEnv : env
        ),
      },
    });
  };

  const handleSetActiveEnvironment = (env: Environment | null) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        activeEnvironmentId: env?.id,
        environments: state.settings.environments.map(e => ({
          ...e,
          isActive: e.id === env?.id,
        })),
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <Globe size={20} className="text-accent" />
          </div>
          <div>
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Environment Manager
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Manage your environments and variables
            </Dialog.Description>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Environments List */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Environments
                </h3>
                <button
                  onClick={() => handleSetActiveEnvironment(null)}
                  className="text-xs text-gray-500 hover:text-accent dark:text-gray-400"
                >
                  Clear Active
                </button>
              </div>

              {state.settings.environments?.map((env) => (
                <div
                  key={env.id}
                  className={cn(
                    "group relative flex items-center justify-between rounded-lg border p-3 transition-colors",
                    env.isActive ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent/50 dark:border-gray-700"
                  )}
                >
                  <button
                    onClick={() => setSelectedEnv(env)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {env.name}
                      </span>
                      {env.isActive && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {env.variables.length} variables
                    </div>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSetActiveEnvironment(env)}
                      className={cn(
                        "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                        env.isActive
                          ? "text-accent hover:bg-accent/10"
                          : "text-gray-500 hover:text-accent dark:text-gray-400"
                      )}
                    >
                      {env.isActive ? 'Active' : 'Set Active'}
                    </button>
                    <button
                      onClick={() => handleDeleteEnvironment(env.id)}
                      className="hidden rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 group-hover:block dark:hover:bg-gray-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  placeholder="New environment name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  onClick={handleCreateEnvironment}
                  disabled={!newEnvName.trim()}
                  className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-accent hover:text-accent disabled:opacity-50 dark:border-gray-600 dark:text-gray-400"
                >
                  <Plus size={16} className="mr-1" />
                  Add Environment
                </button>
              </div>
            </div>
          </div>

          {/* Variables Editor */}
          <div className="col-span-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            {selectedEnv ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedEnv.name} Variables
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedEnv.variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="flex items-start space-x-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center">
                          <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                            {variable.key}
                          </span>
                          {variable.description && (
                            <span className="ml-2 text-xs text-gray-500">
                              {variable.description}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={variable.value}
                          onChange={(e) => {
                            const updatedEnv = {
                              ...selectedEnv,
                              variables: selectedEnv.variables.map(v =>
                                v.id === variable.id
                                  ? { ...v, value: e.target.value }
                                  : v
                              ),
                            };
                            dispatch({
                              type: 'UPDATE_SETTINGS',
                              payload: {
                                environments: state.settings.environments.map(env =>
                                  env.id === selectedEnv.id ? updatedEnv : env
                                ),
                              },
                            });
                          }}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteVariable(variable.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <input
                    type="text"
                    value={newVariable.key}
                    onChange={(e) =>
                      setNewVariable({ ...newVariable, key: e.target.value })
                    }
                    placeholder="Variable name"
                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <input
                    type="text"
                    value={newVariable.value}
                    onChange={(e) =>
                      setNewVariable({ ...newVariable, value: e.target.value })
                    }
                    placeholder="Variable value"
                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <input
                    type="text"
                    value={newVariable.description}
                    onChange={(e) =>
                      setNewVariable({ ...newVariable, description: e.target.value })
                    }
                    placeholder="Description (optional)"
                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={handleAddVariable}
                    disabled={!newVariable.key?.trim()}
                    className="flex w-full items-center justify-center rounded bg-accent px-3 py-1 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Variable
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Settings2 size={48} className="mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No Environment Selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an environment to manage its variables
                </p>
              </div>
            )}
          </div>
        </div>

        <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default EnvironmentManager;