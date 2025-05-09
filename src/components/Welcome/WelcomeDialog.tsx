import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Rocket, Bot, Zap, FolderArchive, History, Sparkles } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetStarted: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({
  open,
  onOpenChange,
  onGetStarted,
}) => {
  const features = [
    {
      icon: <Bot className="h-5 w-5 text-accent" />,
      title: 'AI-Powered Analysis',
      description: 'Get intelligent insights about your API responses using OpenAI integration',
    },
    {
      icon: <FolderArchive className="h-5 w-5 text-accent" />,
      title: 'Collections',
      description: 'Organize and save your API requests in collections for easy access',
    },
    {
      icon: <History className="h-5 w-5 text-accent" />,
      title: 'Request History',
      description: 'Keep track of your recent API requests and responses',
    },
    {
      icon: <Sparkles className="h-5 w-5 text-accent" />,
      title: 'Beautiful Interface',
      description: 'Modern, intuitive interface with dark mode support and customizable themes',
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-gray-700 dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome to REST Client
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your modern, AI-powered tool for testing and debugging APIs
            </Dialog.Description>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center">
                  {feature.icon}
                  <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                onGetStarted();
                onOpenChange(false);
              }}
              className="inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Rocket className="mr-1.5 h-4 w-4" />
              Get Started
            </button>
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

export default WelcomeDialog;