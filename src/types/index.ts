import { ApiRequest } from './api';
import { Collection } from './collection';
import { Settings } from './settings';
import { Tab } from './tabs';

export * from './api';
export * from './collection';
export * from './settings';
export * from './tabs';

export interface AppState {
  collections: Collection[];
  history: ApiRequest[];
  darkMode: boolean;
  settings: Settings;
  tabs: Tab[];
  activeTabId: string | null;
}