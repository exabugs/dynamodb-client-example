/**
 * スキーマレジストリ
 *
 * このファイルは shadow.config.json の生成元となる Single Source of Truth です。
 * ライブラリ（@exabugs/dynamodb-client）の型定義を使用してスキーマを定義します。
 */
import type { SchemaRegistryConfig } from '@exabugs/dynamodb-client/shadows';

import { ArticleSchema } from './models/Article.js';
import { TaskSchema } from './models/Task.js';

/**
 * スキーマレジストリ設定
 *
 * generate-shadow-config CLI がこの設定から shadow.config.json を生成します。
 */
const schemaRegistry: SchemaRegistryConfig = {
  database: {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
  resources: {
    articles: ArticleSchema,
    tasks: TaskSchema,
  },
};

// CLI ツール用のエクスポート
export { schemaRegistry as SchemaRegistryConfig };
export default schemaRegistry;

// 型定義の再エクスポート（便利のため）
export type {
  ResourceSchema,
  ShadowFieldDefinition,
  ShadowFieldType,
} from '@exabugs/dynamodb-client/shadows';

// プロジェクト固有の型定義
export type ResourceName = keyof typeof schemaRegistry.resources;
export type ResourceTypeMap = {
  [K in ResourceName]: (typeof schemaRegistry.resources)[K]['type'];
};
