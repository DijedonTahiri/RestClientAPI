import React from 'react';

interface RawViewProps {
  data: any;
}

const RawView: React.FC<RawViewProps> = ({ data }) => {
  // Format the raw response for display
  const formatRawResponse = () => {
    try {
      if (typeof data === 'string') {
        return data;
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  return (
    <pre className="p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap dark:text-gray-200">
      {formatRawResponse()}
    </pre>
  );
};

export default RawView;