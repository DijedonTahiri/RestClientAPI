import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Tab } from '../../types';
import { Plus, X, Circle } from 'lucide-react';
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { cn } from '../../utils/cn';
import EnvironmentSelector from '../Environment/EnvironmentSelector';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onSelect, onClose }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  const methodColor = {
    GET: 'text-green-600 dark:text-green-400',
    POST: 'text-accent',
    PUT: 'text-amber-600 dark:text-amber-400',
    DELETE: 'text-red-600 dark:text-red-400',
    PATCH: 'text-purple-600 dark:text-purple-400',
    HEAD: 'text-gray-600 dark:text-gray-400',
  }[tab.request.method];

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'group relative flex h-12 min-w-[100px] max-w-[200px] select-none items-center border-r border-gray-200 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-800',
            isActive && 'before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-accent before:content-[""]',
            isActive ? 'bg-gray-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
          onClick={onSelect}
          {...attributes}
          {...listeners}
        >
          <div className="flex flex-1 items-center overflow-hidden">
            <span className={cn('mr-1.5 text-xs font-medium', methodColor)}>
              {tab.request.method}
            </span>
            
            <span className="flex-1 truncate text-xs font-medium text-gray-600 dark:text-gray-300">
              {tab.title || 'Untitled'}
            </span>
            
            {tab.isDirty && (
              <Circle size={4} className="ml-1.5 shrink-0 fill-accent text-accent" />
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-1 hidden rounded-sm p-0.5 hover:bg-gray-200 group-hover:block dark:hover:bg-gray-600"
          >
            <X size={12} />
          </button>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <ContextMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
            Close
          </ContextMenu.Item>
          <ContextMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
            Close Others
          </ContextMenu.Item>
          <ContextMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
            Close All
          </ContextMenu.Item>
          <ContextMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
          <ContextMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
            Add to Group
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

const TabBar: React.FC = () => {
  const { state, dispatch, createRequest } = useAppContext();
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      dispatch({
        type: 'REORDER_TABS',
        payload: { activeId: active.id as string, overId: over.id as string },
      });
    }
  };

  const handleNewTab = () => {
    const request = createRequest();
    dispatch({
      type: 'ADD_TAB',
      payload: {
        id: request.id,
        title: 'Untitled',
        request,
        isDirty: false,
      },
    });
  };

  const handleCloseTab = (tabId: string) => {
    dispatch({ type: 'CLOSE_TAB', payload: tabId });
  };

  const handleSelectTab = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };

  return (
    <div className="flex h-12 items-center border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={state.tabs.map(tab => tab.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-1 overflow-x-auto">
            {state.tabs.map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={tab.id === state.activeTabId}
                onSelect={() => handleSelectTab(tab.id)}
                onClose={() => handleCloseTab(tab.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewTab}
          className="flex h-12 w-12 items-center justify-center border-r border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <Plus size={14} />
        </button>
        <div className="px-2">
          <EnvironmentSelector />
        </div>
      </div>
    </div>
  );
};

export default TabBar;