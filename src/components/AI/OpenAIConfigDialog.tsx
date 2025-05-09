import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, ChevronDown, Check, Bot, Key, Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { cn } from '../../utils/cn';

interface OpenAIConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OpenAIConfigDialog: React.FC<OpenAIConfigDialogProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useAppContext();
  const [apiKey, setApiKey] = useState(state.settings.openai?.apiKey || '');
  const [model, setModel] = useState(state.settings.openai?.model || 'gpt-4.1-nano');

  const models = [
    { 
      value: 'gpt-4.1-nano',
      label: 'GPT-4.1 Nano',
      description: 'Fastest, most cost-effective GPT-4.1 model',
      icon: <Zap size={16} className="mr-2 text-green-500" />,
      price: '$0.10 • $0.40'
    },
    { 
      value: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      description: 'Balanced for intelligence, speed, and cost',
      icon: <Brain size={16} className="mr-2 text-blue-500" />,
      price: '$0.40 • $1.60'
    },
    { 
      value: 'o4-mini',
      label: 'o4-mini',
      description: 'Optimized for fast, effective reasoning',
      icon: <Cpu size={16} className="mr-2 text-amber-500" />,
      price: '$1.10 • $4.40'
    }
  ];

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        openai: {
          apiKey: apiKey.trim(),
          model,
        },
      },
    });
    onOpenChange(false);
  };

  const handleRemove = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        openai: undefined,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Bot size={24} className="text-accent" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                OpenAI Configuration
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
                Configure your OpenAI settings for AI analysis
              </Dialog.Description>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                API Key
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  OpenAI Dashboard
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Model
              </label>
              <Select.Root value={model} onValueChange={setModel}>
                <Select.Trigger className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  <div className="flex items-center justify-between">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown size={16} className="text-gray-400" />
                    </Select.Icon>
                  </div>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <Select.Viewport>
                      {models.map((m) => (
                        <Select.Item
                          key={m.value}
                          value={m.value}
                          className={cn(
                            "flex cursor-pointer items-center px-3 py-2 text-sm text-gray-900 outline-none",
                            "hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700",
                            "focus:bg-gray-100 dark:focus:bg-gray-700",
                            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              {m.icon}
                              <Select.ItemText className="ml-2 font-medium">
                                {m.label}
                              </Select.ItemText>
                            </div>
                            <div className="mt-0.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span>{m.description}</span>
                              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                {m.price}
                              </span>
                            </div>
                          </div>
                          <Select.ItemIndicator className="ml-2">
                            <Check size={16} className="text-accent" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
            <button
              onClick={handleRemove}
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove Configuration
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Save Configuration
              </button>
            </div>
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

export default OpenAIConfigDialog;
