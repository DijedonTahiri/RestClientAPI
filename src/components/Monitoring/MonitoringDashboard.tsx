import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ApiResponse } from '../../types';
import {
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  ChevronRight,
  RefreshCcw,
  Filter,
  Layers,
} from 'lucide-react';

interface EndpointMetrics {
  url: string;
  method: string;
  lastChecked: number;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: {
    timestamp: number;
    value: number;
  }[];
  successRate: number;
  errorRate: number;
  lastResponse?: ApiResponse;
  averageResponseTime: number;
  p95ResponseTime: number;
  totalRequests: number;
  errors: {
    timestamp: number;
    status: number;
    message: string;
  }[];
  statusCodes: Record<number, number>;
  throughput: number; // requests per minute
}

type TimeWindow = '1h' | '3h' | '6h' | '12h' | '24h' | 'all';
type ViewMode = 'all' | 'active-tabs';

const TIME_WINDOWS: { value: TimeWindow; label: string }[] = [
  { value: '1h', label: 'Last hour' },
  { value: '3h', label: 'Last 3 hours' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'all', label: 'All time' },
];

const MonitoringDashboard: React.FC = () => {
  const { state } = useAppContext();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<Record<string, EndpointMetrics>>({});
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('3h');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const getTimeWindowMs = (window: TimeWindow): number => {
    const hours = {
      '1h': 1,
      '3h': 3,
      '6h': 6,
      '12h': 12,
      '24h': 24,
      'all': Infinity,
    }[window];
    return hours * 60 * 60 * 1000;
  };

  const isRequestInTimeWindow = (timestamp: number): boolean => {
    if (timeWindow === 'all') return true;
    const windowMs = getTimeWindowMs(timeWindow);
    return Date.now() - timestamp <= windowMs;
  };

  const isRequestInActiveTab = (request: ApiRequest): boolean => {
    return state.tabs.some(tab => 
      tab.request.method === request.method && 
      tab.request.url === request.url
    );
  };

  useEffect(() => {
    const newEndpoints: Record<string, EndpointMetrics> = {};
    const now = Date.now();
    
    // Filter requests based on time window and view mode
    const filteredHistory = state.history.filter(request => {
      const inTimeWindow = isRequestInTimeWindow(request.timestamp || now);
      const inActiveTab = viewMode === 'active-tabs' ? isRequestInActiveTab(request) : true;
      return inTimeWindow && inActiveTab;
    });

    // Group requests by endpoint
    filteredHistory.forEach(request => {
      const key = `${request.method}-${request.url}`;
      
      if (!newEndpoints[key]) {
        newEndpoints[key] = {
          url: request.url,
          method: request.method,
          lastChecked: now,
          status: 'healthy',
          responseTime: [],
          successRate: 0,
          errorRate: 0,
          averageResponseTime: 0,
          p95ResponseTime: 0,
          totalRequests: 0,
          errors: [],
          statusCodes: {},
          throughput: 0,
        };
      }

      const endpoint = newEndpoints[key];
      endpoint.totalRequests++;

      // Track response time with timestamp
      if (request.time) {
        endpoint.responseTime.push({
          timestamp: request.timestamp || now,
          value: request.time
        });
      }

      // Track status codes
      if (request.status) {
        endpoint.statusCodes[request.status] = (endpoint.statusCodes[request.status] || 0) + 1;

        if (request.status >= 400) {
          endpoint.errors.push({
            timestamp: request.timestamp || now,
            status: request.status,
            message: request.statusText || 'Request failed'
          });
        }
      }
    });

    // Calculate metrics for each endpoint
    Object.values(newEndpoints).forEach(endpoint => {
      const windowMs = getTimeWindowMs(timeWindow);
      const timeWindowStart = now - windowMs;

      // Calculate success rate
      const totalResponses = Object.values(endpoint.statusCodes).reduce((a, b) => a + b, 0);
      const successfulResponses = Object.entries(endpoint.statusCodes)
        .filter(([code]) => Number(code) >= 200 && Number(code) < 400)
        .reduce((sum, [_, count]) => sum + count, 0);

      endpoint.successRate = totalResponses ? (successfulResponses / totalResponses) * 100 : 0;
      endpoint.errorRate = totalResponses ? ((totalResponses - successfulResponses) / totalResponses) * 100 : 0;

      // Calculate response time metrics from within the time window
      const relevantTimes = endpoint.responseTime
        .filter(rt => rt.timestamp >= timeWindowStart)
        .map(rt => rt.value);

      if (relevantTimes.length > 0) {
        const sortedTimes = [...relevantTimes].sort((a, b) => a - b);
        endpoint.averageResponseTime = sortedTimes.reduce((a, b) => a + b, 0) / sortedTimes.length;
        endpoint.p95ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || sortedTimes[sortedTimes.length - 1];
      }

      // Calculate throughput (requests per minute)
      const timeSpanMinutes = Math.max(
        (now - Math.min(...endpoint.responseTime.map(rt => rt.timestamp))) / (60 * 1000),
        1
      );
      endpoint.throughput = endpoint.totalRequests / timeSpanMinutes;

      // Determine status based on recent metrics
      const recentErrors = endpoint.errors.filter(error => error.timestamp >= timeWindowStart);
      const recentErrorRate = (recentErrors.length / endpoint.totalRequests) * 100;

      if (recentErrorRate >= 25 || endpoint.averageResponseTime > 5000) {
        endpoint.status = 'down';
      } else if (recentErrorRate >= 5 || endpoint.averageResponseTime > 2000) {
        endpoint.status = 'degraded';
      } else {
        endpoint.status = 'healthy';
      }
    });

    setEndpoints(newEndpoints);
  }, [state.history, state.tabs, timeWindow, viewMode, lastUpdate]);

  // Auto-refresh metrics every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'healthy' | 'degraded' | 'down'): string => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatThroughput = (rpm: number): string => {
    if (rpm < 1) return `${(rpm * 60).toFixed(1)} req/hour`;
    if (rpm >= 60) return `${(rpm / 60).toFixed(1)} req/sec`;
    return `${rpm.toFixed(1)} req/min`;
  };

  const selectedMetrics = selectedEndpoint ? endpoints[selectedEndpoint] : null;

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Monitoring</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time performance metrics and health status
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value as TimeWindow)}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {TIME_WINDOWS.map(tw => (
                <option key={tw.value} value={tw.value}>{tw.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-gray-400" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Endpoints</option>
              <option value="active-tabs">Active Tabs Only</option>
            </select>
          </div>

          <button
            onClick={() => setLastUpdate(Date.now())}
            className="flex items-center space-x-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <RefreshCcw className="h-4 w-4 text-gray-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Total Endpoints</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(endpoints).length}
            </span>
          </div>
        </div>

        {['healthy', 'degraded', 'down'].map((status) => {
          const count = Object.values(endpoints).filter(e => e.status === status).length;
          const icon = status === 'healthy' ? CheckCircle : status === 'degraded' ? AlertTriangle : XCircle;
          const color = status === 'healthy' ? 'text-green-500' : status === 'degraded' ? 'text-yellow-500' : 'text-red-500';
          
          return (
            <div key={status} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {React.createElement(icon, { className: `h-5 w-5 ${color}` })}
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {status}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Endpoints List */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="font-medium text-gray-900 dark:text-white">Monitored Endpoints</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(endpoints).length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Activity className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No endpoints monitored yet</p>
                <p className="text-xs text-gray-400">Make some API requests to see monitoring data</p>
              </div>
            </div>
          ) : (
            Object.entries(endpoints).map(([key, metrics]) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedEndpoint === key ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(metrics.status)}`} />
                    <div>
                      <div className="flex items-center">
                        <span className={`font-mono text-sm font-medium ${
                          metrics.method === 'GET' ? 'text-green-600 dark:text-green-400' :
                          metrics.method === 'POST' ? 'text-blue-600 dark:text-blue-400' :
                          metrics.method === 'PUT' ? 'text-yellow-600 dark:text-yellow-400' :
                          metrics.method === 'DELETE' ? 'text-red-600 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {metrics.method}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {metrics.url}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                        <span>{metrics.totalRequests} requests</span>
                        <span>•</span>
                        <span>Avg {formatTime(metrics.averageResponseTime)}</span>
                        <span>•</span>
                        <span>{formatThroughput(metrics.throughput)}</span>
                        <span>•</span>
                        <span className={metrics.successRate >= 95 ? 'text-green-500' : metrics.successRate >= 80 ? 'text-yellow-500' : 'text-red-500'}>
                          {metrics.successRate.toFixed(1)}% success
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected Endpoint Details */}
      {selectedMetrics && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(selectedMetrics.status)}`} />
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {selectedMetrics.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Updated {new Date(selectedMetrics.lastChecked).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMetrics.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Response Time</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(selectedMetrics.averageResponseTime)}
                </div>
                <div className="text-sm text-gray-500">Average</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                P95: {formatTime(selectedMetrics.p95ResponseTime)}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Throughput</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatThroughput(selectedMetrics.throughput)}
                </div>
                <div className="text-sm text-gray-500">Current Rate</div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Requests</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMetrics.totalRequests}
                </div>
                <div className="text-sm text-gray-500">
                  In {timeWindow === 'all' ? 'total' : `last ${timeWindow}`}
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Trend */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Response Time Trend</h3>
              <span className="text-xs text-gray-500">Last {timeWindow}</span>
            </div>
            <div className="h-48">
              {selectedMetrics.responseTime.length > 0 ? (
                <div className="relative h-full">
                  <div className="absolute inset-0 flex items-end justify-between">
                    {selectedMetrics.responseTime.slice(-30).map((rt, index) => {
                      const height = `${(rt.value / selectedMetrics.p95ResponseTime) * 100}%`;
                      const isError = rt.value > 2000;
                      return (
                        <div
                          key={index}
                          className={`w-2 rounded-t ${isError ? 'bg-red-500' : 'bg-accent'}`}
                          style={{ height }}
                          title={`${formatTime(rt.value)} at ${new Date(rt.timestamp).toLocaleTimeString()}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No response time data available
                </div>
              )}
            </div>
          </div>

          {/* Status Code Distribution */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Status Codes</h3>
            <div className="space-y-2">
              {Object.entries(selectedMetrics.statusCodes).map(([code, count]) => (
                <div key={code} className="flex items-center">
                  <span className={`w-16 text-sm ${
                    Number(code) >= 200 && Number(code) < 300 ? 'text-green-600' :
                    Number(code) >= 300 && Number(code) < 400 ? 'text-blue-600' :
                    Number(code) >= 400 && Number(code) < 500 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {code}
                  </span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full ${
                          Number(code) >= 200 && Number(code) < 300 ? 'bg-green-500' :
                          Number(code) >= 300 && Number(code) < 400 ? 'bg-blue-500' :
                          Number(code) >= 400 && Number(code) < 500 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(count / selectedMetrics.totalRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 w-16 text-right text-sm text-gray-500">
                    {((count / selectedMetrics.totalRequests) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Errors */}
          {selectedMetrics.errors.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Recent Errors</h3>
              <div className="space-y-2">
                {selectedMetrics.errors.slice(0, 5).map((error, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex items-center">
                      <span className="text-red-600">{error.status}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-900 dark:text-white">{error.message}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;