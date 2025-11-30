/**
 * 共通型定義（Single Source of Truth）
 *
 * このファイルは、プロジェクト全体で使用される型定義と選択肢定義を提供します。
 * enumは使用せず、軽量でtree-shakeableなstring literal unionを使用します。
 */

// ========================================
// Article関連の型定義
// ========================================

/**
 * 記事のステータス
 * - draft: 下書き
 * - published: 公開済み
 * - archived: アーカイブ済み
 */
export type ArticleStatus = 'draft' | 'published' | 'archived';

/**
 * 記事ステータスの選択肢定義
 * react-adminのSelectInputなどで使用
 */
export const ARTICLE_STATUS_CHOICES = [
  { id: 'draft', name: '下書き' },
  { id: 'published', name: '公開済み' },
  { id: 'archived', name: 'アーカイブ済み' },
];

// ========================================
// Task関連の型定義
// ========================================

/**
 * タスクのステータス
 * - todo: 未着手
 * - in_progress: 進行中
 * - done: 完了
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * タスクステータスの選択肢定義
 * react-adminのSelectInputなどで使用
 */
export const TASK_STATUS_CHOICES = [
  { id: 'todo', name: '未着手' },
  { id: 'in_progress', name: '進行中' },
  { id: 'done', name: '完了' },
];

/**
 * タスクの優先度
 * - low: 低
 * - medium: 中
 * - high: 高
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * タスク優先度の選択肢定義
 * react-adminのSelectInputなどで使用
 */
export const TASK_PRIORITY_CHOICES = [
  { id: 'low', name: '低' },
  { id: 'medium', name: '中' },
  { id: 'high', name: '高' },
];
