/**
 * Task リソース
 */
import type { ResultBase } from '@exabugs/dynamodb-client/client';
import type { ResourceSchema } from '@exabugs/dynamodb-client/shadows';

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
 * Task スキーマ定義
 *
 * @exabugs/dynamodb-client v0.3.x では、シャドウ設定は環境変数ベースになりました。
 * すべてのフィールドが自動的にシャドウ化されるため、shadows プロパティは不要です。
 */
export const TaskSchema: ResourceSchema<Task> = {
  resource: 'tasks',
  type: {} as Task,
};
