import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { ApiRequest, AppState, Collection, HttpMethod, KeyValuePair, ThemeMode, SidebarState, AccentColor, Tab } from '../types';
import { loadState, saveState } from '../utils/storage';

type Action =
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'ADD_TO_HISTORY'; payload: ApiRequest }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'ADD_COLLECTION'; payload: { name: string } }
  | { type: 'RENAME_COLLECTION'; payload: { id: string; name: string } }
  | { type: 'DELETE_COLLECTION'; payload: { id: string } }
  | { type: 'SAVE_REQUEST'; payload: { collectionId: string; request: ApiRequest } }
  | { type: 'DELETE_REQUEST'; payload: { collectionId: string; requestId: string } }
  | { type: 'IMPORT_COLLECTIONS'; payload: Collection[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'ADD_TAB'; payload: Tab }
  | { type: 'CLOSE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'UPDATE_TAB'; payload: { id: string; updates: Partial<Tab> } }
  | { type: 'REORDER_TABS'; payload: { activeId: string; overId: string } };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  createRequest: () => ApiRequest;
  createKeyValuePair: () => KeyValuePair;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  collections: [],
  history: [],
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  settings: {
    sidebarState: 'expanded',
    themeMode: 'system',
    accentColor: 'blue',
  },
  tabs: [],
  activeTabId: null,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      document.documentElement.classList.toggle('dark', action.payload);
      return { ...state, darkMode: action.payload };

    case 'ADD_TO_HISTORY': {
      const filteredHistory = state.history.filter(item => item.id !== action.payload.id);
      const newHistory = [action.payload, ...filteredHistory].slice(0, 20);
      return { ...state, history: newHistory };
    }

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    case 'ADD_COLLECTION': {
      const newCollection: Collection = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        requests: [],
      };
      return { ...state, collections: [...state.collections, newCollection] };
    }

    case 'RENAME_COLLECTION': {
      const { id, name } = action.payload;
      const collections = state.collections.map(collection =>
        collection.id === id ? { ...collection, name } : collection
      );
      return { ...state, collections };
    }

    case 'DELETE_COLLECTION': {
      const collections = state.collections.filter(
        collection => collection.id !== action.payload.id
      );
      return { ...state, collections };
    }

    case 'SAVE_REQUEST': {
      const { collectionId, request } = action.payload;
      const collections = state.collections.map(collection => {
        if (collection.id !== collectionId) return collection;

        const requestIndex = collection.requests.findIndex(r => r.id === request.id);
        if (requestIndex !== -1) {
          const requests = [...collection.requests];
          requests[requestIndex] = request;
          return { ...collection, requests };
        } else {
          return {
            ...collection,
            requests: [...collection.requests, request],
          };
        }
      });

      return { ...state, collections };
    }

    case 'DELETE_REQUEST': {
      const { collectionId, requestId } = action.payload;
      const collections = state.collections.map(collection => {
        if (collection.id !== collectionId) return collection;

        return {
          ...collection,
          requests: collection.requests.filter(r => r.id !== requestId),
        };
      });

      return { ...state, collections };
    }

    case 'IMPORT_COLLECTIONS':
      return {
        ...state,
        collections: [...state.collections, ...action.payload],
      };

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };

      if (action.payload.themeMode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = action.payload.themeMode === 'dark' ||
          (action.payload.themeMode === 'system' && prefersDark);

        document.documentElement.classList.toggle('dark', shouldBeDark);
        return {
          ...state,
          settings: newSettings,
          darkMode: shouldBeDark,
        };
      }

      if (action.payload.accentColor) {
        document.documentElement.style.setProperty('--accent-color', `var(--${action.payload.accentColor}-500)`);
      }

      return { ...state, settings: newSettings };
    }

    case 'ADD_TAB': {
      const tabs = [...state.tabs, action.payload];
      return {
        ...state,
        tabs,
        activeTabId: action.payload.id,
      };
    }

    case 'CLOSE_TAB': {
      const tabs = state.tabs.filter(tab => tab.id !== action.payload);
      let activeTabId = state.activeTabId;

      if (activeTabId === action.payload) {
        const closedTabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
        if (closedTabIndex > 0) {
          activeTabId = state.tabs[closedTabIndex - 1].id;
        } else if (tabs.length > 0) {
          activeTabId = tabs[0].id;
        } else {
          activeTabId = null;
        }
      }

      return { ...state, tabs, activeTabId };
    }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTabId: action.payload };

    case 'UPDATE_TAB': {
      const tabs = state.tabs.map(tab =>
        tab.id === action.payload.id
          ? { ...tab, ...action.payload.updates }
          : tab
      );
      return { ...state, tabs };
    }

    case 'REORDER_TABS': {
      const { activeId, overId } = action.payload;
      const oldIndex = state.tabs.findIndex(tab => tab.id === activeId);
      const newIndex = state.tabs.findIndex(tab => tab.id === overId);

      const tabs = [...state.tabs];
      const [movedTab] = tabs.splice(oldIndex, 1);
      tabs.splice(newIndex, 0, movedTab);

      return { ...state, tabs };
    }

    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    const stored = loadState();
    return {
      ...initial,
      ...(stored || {}),
      settings: {
        ...initial.settings,
        ...(stored?.settings || {}),
      },
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (state.settings.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        dispatch({ type: 'SET_DARK_MODE', payload: e.matches });
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.settings.themeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', `var(--${state.settings.accentColor}-500)`);
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, []);

  const createRequest = (): ApiRequest => ({
    id: crypto.randomUUID(),
    name: 'Untitled',
    method: 'GET' as HttpMethod,
    url: '',
    params: [createKeyValuePair()],
    headers: [createKeyValuePair()],
    body: '',
  });

  const createKeyValuePair = (): KeyValuePair => ({
    id: crypto.randomUUID(),
    key: '',
    value: '',
    enabled: true,
  });

  return (
    <AppContext.Provider value={{ state, dispatch, createRequest, createKeyValuePair }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};