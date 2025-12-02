/**
 * Article リソース
 */
import type { ResultBase } from '@exabugs/dynamodb-client/client';

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
 * Article リソース名
 *
 * @exabugs/dynamodb-client v0.3.0+ では、シャドウレコードは自動生成されます。
 * リソース名定数のみを定義し、型定義と組み合わせて使用します。
 */
export const ARTICLE_RESOURCE = 'articles' as const;
