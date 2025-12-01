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
 */
export const ArticleSchema: ResourceSchema<Article> = {
  resource: 'articles',
  type: {} as Article,
  shadows: {
    sortableFields: {
      title: { type: 'string' },
      status: { type: 'string' },
      author: { type: 'string' },
      createdAt: { type: 'datetime' },
      updatedAt: { type: 'datetime' },
    },
  },
};
