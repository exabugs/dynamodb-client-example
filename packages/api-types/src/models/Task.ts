/**
 * Task リソース
 */
import type { ResultBase } from '@exabugs/dynamodb-client/client';

import type { TaskPriority, TaskStatus } from '../types.js';

/**
 * Task 型定義
 */
export interface Task extends ResultBase {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task リソース名
 *
 * @exabugs/dynamodb-client v0.3.0+ では、シャドウレコードは自動生成されます。
 * リソース名定数のみを定義し、型定義と組み合わせて使用します。
 */
export const TASK_RESOURCE = 'tasks' as const;
