/**
 * Task リソースの型定義とスキーマ定義
 */
import { SchemaDefinition } from '../schema.js';
import type { TaskPriority, TaskStatus } from '../types.js';

/**
 * Task リソースの型定義
 */
export interface Task {
  /** レコードID */
  id: string;
  /** タスク名 */
  title: string;
  /** タスクの説明 */
  description: string;
  /** ステータス */
  status: TaskStatus;
  /** 優先度 */
  priority: TaskPriority;
  /** 期限日時（ISO 8601形式） */
  dueDate?: string;
  /** 作成日時（ISO 8601形式） */
  createdAt: string;
  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
}

/**
 * Task リソースのスキーマ定義
 *
 * ソート可能なフィールド:
 * - title: タスク名でのソート
 * - status: ステータスでのソート
 * - priority: 優先度でのソート
 * - dueDate: 期限日時でのソート
 * - createdAt: 作成日時でのソート
 * - updatedAt: 更新日時でのソート
 */
export const TaskSchema: SchemaDefinition<Task> = {
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
