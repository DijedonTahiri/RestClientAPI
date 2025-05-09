import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewProps {
  data: any;
}

const JsonView: React.FC<JsonViewProps> = ({ data }) => {
  return (
    <div className="p-4 font-mono text-sm">
      <JsonNode data={data} name="root" isRoot={true} />
    </div>
  );
};

interface JsonNodeProps {
  data: any;
  name: string;
  isRoot?: boolean;
  level?: number;
}

const JsonNode: React.FC<JsonNodeProps> = ({ 
  data, 
  name, 
  isRoot = false, 
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Handle toggle node expansion
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  // Determine the type of data
  const getType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };
  
  // Get appropriate color for the data type
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'string':
        return 'text-green-600 dark:text-green-400';
      case 'number':
        return 'text-blue-600 dark:text-blue-400';
      case 'boolean':
        return 'text-amber-600 dark:text-amber-400';
      case 'null':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };
  
  // Format the value for display
  const formatValue = (value: any, type: string): React.ReactNode => {
    switch (type) {
      case 'string':
        return `"${value}"`;
      case 'null':
        return 'null';
      default:
        return String(value);
    }
  };
  
  const type = getType(data);
  const isPrimitive = ['string', 'number', 'boolean', 'null', 'undefined'].includes(type);
  const isEmptyObject = type === 'object' && Object.keys(data).length === 0;
  const isEmptyArray = type === 'array' && data.length === 0;
  
  // Handle empty values
  if (isEmptyObject) {
    return (
      <div className="flex items-start">
        {!isRoot && (
          <span className="mr-1 text-gray-600 dark:text-gray-400">{name}: </span>
        )}
        <span className="text-gray-800 dark:text-gray-200">{'{}'}</span>
      </div>
    );
  }
  
  if (isEmptyArray) {
    return (
      <div className="flex items-start">
        {!isRoot && (
          <span className="mr-1 text-gray-600 dark:text-gray-400">{name}: </span>
        )}
        <span className="text-gray-800 dark:text-gray-200">{'[]'}</span>
      </div>
    );
  }
  
  // Handle primitive values
  if (isPrimitive) {
    return (
      <div className="flex items-start">
        {!isRoot && (
          <span className="mr-1 text-gray-600 dark:text-gray-400">{name}: </span>
        )}
        <span className={getTypeColor(type)}>{formatValue(data, type)}</span>
      </div>
    );
  }
  
  // Handle complex objects and arrays
  const isArray = Array.isArray(data);
  const items = isArray ? data : Object.keys(data);
  
  return (
    <div>
      <div 
        className="flex cursor-pointer items-start" 
        onClick={toggleExpand}
      >
        <span className="mr-1 text-gray-600 dark:text-gray-300">
          {isExpanded ? (
            <ChevronDown size={14} className="inline" />
          ) : (
            <ChevronRight size={14} className="inline" />
          )}
        </span>
        
        {!isRoot && (
          <span className="mr-1 text-gray-600 dark:text-gray-400">{name}: </span>
        )}
        
        <span className="text-gray-800 dark:text-gray-200">
          {isArray ? '[' : '{'}
          {!isExpanded && '...'}
          {!isExpanded && (isArray ? ']' : '}')}
        </span>
      </div>
      
      {isExpanded && (
        <div className="ml-4 border-l border-gray-300 pl-2 dark:border-gray-600">
          {isArray ? (
            items.map((item, index) => (
              <JsonNode 
                key={index} 
                data={item} 
                name={String(index)} 
                level={level + 1} 
              />
            ))
          ) : (
            Object.keys(data).map((key) => (
              <JsonNode 
                key={key} 
                data={data[key]} 
                name={key} 
                level={level + 1} 
              />
            ))
          )}
          <div className="text-gray-800 dark:text-gray-200">
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonView;