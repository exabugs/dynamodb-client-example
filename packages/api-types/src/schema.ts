/**
 * スキーマレジストリ
 *
 * @exabugs/dynamodb-client v0.3.x では、シャドウ設定は環境変数ベースになりました。
 * このファイルは型定義とリソース管理のために保持されています。
 */
import { ArticleSchema } from './models/Article.js';
import { TaskSchema } from './models/Task.js';

/**
 * リソーススキーマレジストリ
 *
 * 各リソースのスキーマ定義を集約します。
 * シャドウレコードは自動的に生成されるため、shadow.config.json は不要です。
 */
const schemaRegistry = {
  resources: {
    articles: ArticleSchema,
    tasks: TaskSchema,
  },
};

// プロジェクト固有の型定義（型安全なリソース名とマッピング）
export type ResourceName = keyof typeof schemaRegistry.resources;
export type ResourceTypeMap = {
  [K in ResourceName]: (typeof schemaRegistry.resources)[K]['type'];
};
