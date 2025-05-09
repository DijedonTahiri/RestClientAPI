import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { SidebarState, ThemeMode, AccentColor } from '../types';
import {
  ArrowLeft,
  Monitor,
  Sun,
  Moon,
  Layout,
  Zap,
  FolderOpen,
  History,
  Settings as SettingsIcon,
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const sidebarStates: { value: SidebarState; label: string }[] = [
    { value: 'expanded', label: 'Always Expanded' },
    { value: 'collapsed', label: 'Always Collapsed' },
  ];

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light Mode', icon: <Sun size={20} /> },
    { value: 'dark', label: 'Dark Mode', icon: <Moon size={20} /> },
    { value: 'system', label: 'System', icon: <Monitor size={20} /> },
  ];

  const accentColors: { value: AccentColor; label: string; class: string }[] = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  ];

  const updateSettings = (key: keyof typeof state.settings, value: any) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value },
    });
  };

  const SidebarPreview: React.FC<{ state: SidebarState }> = ({ state: sidebarState }) => (
    <div className={`relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
      sidebarState === 'collapsed' ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex h-8 items-center border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-800">
        <Zap size={16} className="text-accent" />
        <span className="ml-2 text-xs font-medium">REST Client</span>
      </div>

      {/* Content */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${
          sidebarState === 'expanded' ? 'w-1/3' : 'w-10'
        }`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 border-r border-gray-200 p-2 dark:border-gray-700">
              <FolderOpen size={14} className="mx-auto text-accent" />
            </div>
           
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Theme</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appearance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => updateSettings('themeMode', mode.value)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-4 ${
                        state.settings.themeMode === mode.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mode.icon}
                      <span className="mt-2 text-sm">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Accent Color
                </label>
                <div className="grid grid-cols-6 gap-4">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSettings('accentColor', color.value)}
                      className={`group relative h-12 w-12 rounded-full ${color.class} ${
                        state.settings.accentColor === color.value
                          ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800'
                          : ''
                      }`}
                      title={color.label}
                    >
                      <span className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-700">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Sidebar</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {sidebarStates.map((sidebarOption) => (
                  <button
                    key={sidebarOption.value}
                    onClick={() => updateSettings('sidebarState', sidebarOption.value)}
                    className={`relative overflow-hidden rounded-lg border p-4 transition-all ${
                      state.settings.sidebarState === sidebarOption.value
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-200 hover:border-accent/50 dark:border-gray-700'
                    }`}
                  >
                    <div className="mb-2 text-sm font-medium">
                      {sidebarOption.label}
                    </div>
                    <SidebarPreview state={sidebarOption.value} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editor</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Coming soon</span>
            </div>
            <div className="mt-4 space-y-4 opacity-50">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">Font Size</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Adjust the editor font size</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">Tab Size</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Set indentation width</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">Word Wrap</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Toggle line wrapping</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Request Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Request Defaults</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Coming soon</span>
            </div>
            <div className="mt-4 space-y-4 opacity-50">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">Timeout</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Default request timeout</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">Default Headers</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Set default request headers</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-medium">SSL Verification</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Toggle SSL certificate verification</div>
                </div>
                <SettingsIcon size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;