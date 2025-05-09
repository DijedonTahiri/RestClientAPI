import { ApiRequest, ApiResponse, KeyValuePair } from '../types';

// Build URL with query parameters
const buildUrl = (url: string, params: KeyValuePair[]): string => {
  const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
  
  params
    .filter(param => param.enabled && param.key.trim() !== '')
    .forEach(param => {
      urlObj.searchParams.append(param.key, param.value);
    });
    
  return urlObj.toString();
};

// Build headers object
const buildHeaders = (headers: KeyValuePair[]): Record<string, string> => {
  return headers
    .filter(header => header.enabled && header.key.trim() !== '')
    .reduce((acc, header) => {
      acc[header.key] = header.value;
      return acc;
    }, {} as Record<string, string>);
};

// Send API request
export const sendRequest = async (request: ApiRequest): Promise<ApiResponse> => {
  const { method, url, params, headers, body } = request;
  
  const fullUrl = buildUrl(url, params);
  const headerObj = buildHeaders(headers);
  
  const startTime = performance.now();
  const timestamp = Date.now();
  
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: headerObj,
      body: ['GET', 'HEAD'].includes(method) ? undefined : body,
    });
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Get response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    // Get response body based on content type
    let responseBody: any;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    
    // Calculate response size
    const responseSize = JSON.stringify(responseBody).length;
    
    // Update request with response info
    request.status = response.status;
    request.statusText = response.statusText;
    request.time = Math.round(responseTime);
    request.timestamp = timestamp;
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      time: Math.round(responseTime),
      size: responseSize,
      timestamp,
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    // Update request with error info
    request.status = 0;
    request.statusText = error instanceof Error ? error.message : 'Network Error';
    request.time = responseTime;
    request.timestamp = timestamp;
    
    return {
      status: 0,
      statusText: error instanceof Error ? error.message : 'Network Error',
      headers: {},
      body: { error: error instanceof Error ? error.message : 'Unknown error' },
      time: responseTime,
      size: 0,
      timestamp,
    };
  }
};

// Generate curl command from request
export const generateCurlCommand = (request: ApiRequest): string => {
  const { method, url, params, headers, body } = request;
  
  const fullUrl = buildUrl(url, params);
  
  let command = `curl -X ${method} "${fullUrl}"`;
  
  headers
    .filter(header => header.enabled && header.key.trim() !== '')
    .forEach(header => {
      command += ` \\\n  -H "${header.key}: ${header.value}"`;
    });
    
  if (!['GET', 'HEAD'].includes(method) && body.trim() !== '') {
    command += ` \\\n  -d '${body}'`;
  }
  
  return command;
};