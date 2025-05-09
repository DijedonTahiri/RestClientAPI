export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
  isActive: boolean;
}

export type EnvironmentScope = 'global' | 'collection';