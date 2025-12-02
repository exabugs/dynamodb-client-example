/**
 * Article リソース
 */
import type { ResultBase } from '@exabugs/dynamodb-client/client';
import type { ResourceSchema } from '@exabugs/dynamodb-client/shadows';

import type { ArticleStatus } from '../types.js';

/**
 * Article 型定義
 */
export interface Article extends ResultBase {
  title: string;
  content: string;
  status: ArticleStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Article スキーマ定義
 *
 * @exabugs/dynamodb-client v0.3.x では、シャドウ設定は環境変数ベースになりました。
 * すべてのフィールドが自動的にシャドウ化されるため、shadows プロパティは不要です。
 */
export const ArticleSchema: ResourceSchema<Article> = {
  resource: 'articles',
  type: {} as Article,
};
