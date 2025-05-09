import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus } from 'lucide-react';
import { ApiRequest } from '../../types';
import { exampleApis } from '../../data/example-apis';
import { cn } from '../../utils/cn';

interface GetStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRequest: (request: ApiRequest) => void;
}

const GetStartedDialog: React.FC<GetStartedDialogProps> = ({
  open,
  onOpenChange,
  onSelectRequest,
}) => {
  const handleSelectRequest = (request: ApiRequest) => {
    onSelectRequest(request);
    onOpenChange(false);
  };

  const handleNewRequest = () => {
    handleSelectRequest({
      id: crypto.randomUUID(),
      name: 'New Request',
      method: 'GET',
      url: '',
      params: [],
      headers: [],
      body: '',
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-gray-700 dark:bg-gray-900">
          <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Get Started
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start with a blank request or choose from our collection of example APIs.
          </Dialog.Description>

          <div className="mt-6">
            <button
              onClick={handleNewRequest}
              className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-colors hover:border-accent hover:bg-accent/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent"
            >
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <Plus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Start with a Blank Request
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new request from scratch
                </p>
              </div>
            </button>
          </div>

          <div className="mt-8 space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Example APIs
            </h3>
            {exampleApis.map((category) => (
              <div key={category.name} className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {category.name}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.apis.map((api) => (
                    <button
                      key={api.id}
                      onClick={() => handleSelectRequest(api)}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-accent hover:bg-accent/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'inline-block rounded px-2 py-1 text-xs font-medium',
                              api.method === 'GET' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                              api.method === 'POST' && 'bg-accent/10 text-accent',
                              api.method === 'PUT' && 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
                              api.method === 'DELETE' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            )}
                          >
                            {api.method}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {api.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {api.description}
                        </p>
                        <div className="mt-2 truncate text-xs text-gray-500 dark:text-gray-500">
                          {api.url}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GetStartedDialog;