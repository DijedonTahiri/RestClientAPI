import React from 'react';

interface HeadersViewProps {
  headers: Record<string, string>;
}

const HeadersView: React.FC<HeadersViewProps> = ({ headers }) => {
  const headerEntries = Object.entries(headers);

  if (headerEntries.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No headers found in the response
      </div>
    );
  }

  return (
    <div className="p-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-gray-100">Name</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-gray-100">Value</th>
          </tr>
        </thead>
        <tbody>
          {headerEntries.map(([name, value]) => (
            <tr 
              key={name} 
              className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <td className="py-2 px-4 font-medium text-gray-700 dark:text-gray-300">{name}</td>
              <td className="py-2 px-4 text-gray-600 dark:text-gray-400 font-mono break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeadersView;