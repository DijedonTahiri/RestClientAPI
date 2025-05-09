export type Language = 'en' | 'es' | 'fr' | 'de';
export type SidebarState = 'expanded' | 'collapsed';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'purple' | 'green' | 'red' | 'amber' | 'pink';

export interface OpenAISettings {
  apiKey: string;
  model: string;
}

export interface Settings {
  sidebarState: SidebarState;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  openai?: OpenAISettings;
  environments: Environment[];
  activeEnvironmentId?: string;
}