/**
 * Task リソース
 */
import type { ResourceSchema } from '@exabugs/dynamodb-client/shadows';

import type { TaskPriority, TaskStatus } from '../types.js';

/**
 * Task 型定義
 */
export interface Task {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task スキーマ定義
 */
export const TaskSchema: ResourceSchema<Task> = {
  resource: 'tasks',
  type: {} as Task,
  shadows: {
    sortableFields: {
      title: { type: 'string' },
      status: { type: 'string' },
      priority: { type: 'string' },
      dueDate: { type: 'datetime' },
      createdAt: { type: 'datetime' },
      updatedAt: { type: 'datetime' },
    },
  },
};
