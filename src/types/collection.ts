import { ApiRequest } from './api';

export interface Collection {
  id: string;
  name: string;
  requests: ApiRequest[];
}