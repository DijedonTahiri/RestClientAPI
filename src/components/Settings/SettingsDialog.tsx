import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, Check, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Language, SidebarState, ThemeMode, AccentColor } from '../../types';
import { useTranslation } from 'react-i18next';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useAppContext();
  const { t } = useTranslation();

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const sidebarStates: { value: SidebarState; label: string }[] = [
    { value: 'expanded', label: t('settings.sidebar.expanded') },
    { value: 'collapsed', label: t('settings.sidebar.collapsed') },
    { value: 'auto', label: t('settings.sidebar.auto') },
  ];

  const themeModes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
    { value: 'system', label: t('settings.theme.system') },
  ];

  const accentColors: { value: AccentColor; label: string; class: string }[] = [
    { value: 'blue', label: t('settings.colors.blue'), class: 'bg-blue-500' },
    { value: 'purple', label: t('settings.colors.purple'), class: 'bg-purple-500' },
    { value: 'green', label: t('settings.colors.green'), class: 'bg-green-500' },
    { value: 'red', label: t('settings.colors.red'), class: 'bg-red-500' },
    { value: 'amber', label: t('settings.colors.amber'), class: 'bg-amber-500' },
    { value: 'pink', label: t('settings.colors.pink'), class: 'bg-pink-500' },
  ];

  const updateSettings = (key: keyof typeof state.settings, value: any) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value },
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-gray-700 dark:bg-gray-900">
          <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.title')}
          </Dialog.Title>

          <div className="mt-6 space-y-6">
            {/* General Settings */}
            <section>
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t('settings.general.title')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.general.language')}
                  </label>
                  <Select.Root
                    value={state.settings.language}
                    onValueChange={(value: Language) => updateSettings('language', value)}
                  >
                    <Select.Trigger className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <Select.Viewport>
                          {languages.map((language) => (
                            <Select.Item
                              key={language.value}
                              value={language.value}
                              className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Select.ItemText>{language.label}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.general.sidebar')}
                  </label>
                  <Select.Root
                    value={state.settings.sidebarState}
                    onValueChange={(value: SidebarState) => updateSettings('sidebarState', value)}
                  >
                    <Select.Trigger className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <Select.Viewport>
                          {sidebarStates.map((state) => (
                            <Select.Item
                              key={state.value}
                              value={state.value}
                              className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Select.ItemText>{state.label}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>
            </section>

            {/* Theme Settings */}
            <section>
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t('settings.theme.title')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.theme.mode')}
                  </label>
                  <Select.Root
                    value={state.settings.themeMode}
                    onValueChange={(value: ThemeMode) => updateSettings('themeMode', value)}
                  >
                    <Select.Trigger className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <Select.Viewport>
                          {themeModes.map((mode) => (
                            <Select.Item
                              key={mode.value}
                              value={mode.value}
                              className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Select.ItemText>{mode.label}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.theme.accent')}
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateSettings('accentColor', color.value)}
                        className={`h-8 w-8 rounded-full ${color.class} ${
                          state.settings.accentColor === color.value
                            ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900'
                            : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Settings */}
            <section>
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t('settings.advanced.title')}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>{t('settings.advanced.version')}: 1.0.0</p>
                <button
                  onClick={() => {
                    if (confirm(t('settings.advanced.resetConfirm'))) {
                      dispatch({ type: 'RESET_SETTINGS' });
                    }
                  }}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t('settings.advanced.reset')}
                </button>
              </div>
            </section>
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:data-[state=open]:bg-gray-800">
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsDialog;