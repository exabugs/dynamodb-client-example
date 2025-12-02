/**
 * スキーマレジストリ
 *
 * @exabugs/dynamodb-client v0.3.0+ では、シャドウレコードは自動生成されます。
 * このファイルは型定義とリソース名の集約のみを行います。
 */
import { ARTICLE_RESOURCE, type Article } from './models/Article.js';
import { TASK_RESOURCE, type Task } from './models/Task.js';

/**
 * リソース名とその型のマッピング
 *
 * 型安全なリソース操作のための定義です。
 */
export const RESOURCES = {
  [ARTICLE_RESOURCE]: {} as Article,
  [TASK_RESOURCE]: {} as Task,
} as const;

/**
 * リソース名の型
 */
export type ResourceName = keyof typeof RESOURCES;

/**
 * リソース名から型へのマッピング
 */
export type ResourceTypeMap = {
  [K in ResourceName]: (typeof RESOURCES)[K];
};
