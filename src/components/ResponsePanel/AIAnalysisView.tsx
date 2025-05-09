import React, { useState } from 'react';
import { ApiResponse } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { analyzeResponse } from '../../utils/openai';
import { Bot, Loader2 } from 'lucide-react';
import OpenAIConfigDialog from '../AI/OpenAIConfigDialog';

interface AIAnalysisViewProps {
  response: ApiResponse;
}

const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({ response }) => {
  const { state } = useAppContext();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const handleAnalyze = async () => {
    if (!state.settings.openai?.apiKey) {
      setShowConfig(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeResponse(state.settings.openai.apiKey, response);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze response');
    } finally {
      setLoading(false);
    }
  };

  if (!state.settings.openai?.apiKey) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bot size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium">OpenAI API Key Required</h3>
          <p className="mb-4 text-sm text-gray-500">
            To analyze API responses with AI, you need to configure your OpenAI API key.
          </p>
          <button
            onClick={() => setShowConfig(true)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Configure OpenAI
          </button>
        </div>
        <OpenAIConfigDialog open={showConfig} onOpenChange={setShowConfig} />
      </>
    );
  }

  if (!analysis && !loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bot size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium">AI Response Analysis</h3>
          <p className="mb-4 text-sm text-gray-500">
            Get insights about your API response using OpenAI's GPT model.
          </p>
          <div className="space-x-2">
            <button
              onClick={handleAnalyze}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Analyze Response
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Configure
            </button>
          </div>
        </div>
        <OpenAIConfigDialog open={showConfig} onOpenChange={setShowConfig} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 size={48} className="mb-4 animate-spin text-accent" />
        <h3 className="text-lg font-medium">Analyzing Response</h3>
        <p className="text-sm text-gray-500">
          Please wait while we analyze your API response...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <Bot size={32} />
          </div>
          <h3 className="mb-2 text-lg font-medium text-red-600 dark:text-red-400">Analysis Failed</h3>
          <p className="text-sm text-gray-500">{error}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={handleAnalyze}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Try Again
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Configure
            </button>
          </div>
        </div>
        <OpenAIConfigDialog open={showConfig} onOpenChange={setShowConfig} />
      </>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Bot size={20} className="mr-2 text-accent" />
            <h3 className="text-sm font-medium">AI Analysis</h3>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAnalyze}
              className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Refresh Analysis
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Configure
            </button>
          </div>
        </div>
        <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-800">
          {analysis}
        </div>
      </div>
      <OpenAIConfigDialog open={showConfig} onOpenChange={setShowConfig} />
    </>
  );
};

export default AIAnalysisView;