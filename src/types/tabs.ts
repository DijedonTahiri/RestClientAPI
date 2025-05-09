import { ApiRequest } from './api';

export interface Tab {
  id: string;
  title: string;
  request: ApiRequest;
  isDirty: boolean;
  groupId?: string;
}

export interface TabGroup {
  id: string;
  title: string;
  tabs: string[];
  color?: string;
}