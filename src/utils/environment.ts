import { Environment } from '../types/environment';

export const interpolateVariables = (text: string, environment?: Environment): string => {
  if (!environment || !text) return text;

  return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const variable = environment.variables.find(v => v.key === key.trim());
    return variable ? variable.value : match;
  });
};

export const processRequestWithEnvironment = (request: any, environment?: Environment): any => {
  if (!environment) return request;

  const processValue = (value: any): any => {
    if (typeof value === 'string') {
      return interpolateVariables(value, environment);
    }
    if (Array.isArray(value)) {
      return value.map(processValue);
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: processValue(v),
      }), {});
    }
    return value;
  };

  return processValue(request);
};