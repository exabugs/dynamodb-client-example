/**
 * Article リソースの型定義とスキーマ定義
 */
import { SchemaDefinition } from '../schema.js';
import type { ArticleStatus } from '../types.js';

/**
 * Article リソースの型定義
 */
export interface Article {
  /** インデックスシグネチャ（DynamoDB Client SDK の要件） */
  [key: string]: unknown;
  /** レコードID */
  id: string;
  /** 記事タイトル */
  title: string;
  /** 記事内容 */
  content: string;
  /** ステータス */
  status: ArticleStatus;
  /** 著者名 */
  author: string;
  /** 作成日時（ISO 8601形式） */
  createdAt: string;
  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
}

/**
 * Article リソースのスキーマ定義
 *
 * ソート可能なフィールド:
 * - title: 記事タイトルでのソート
 * - status: ステータスでのソート
 * - author: 著者名でのソート
 * - createdAt: 作成日時でのソート
 * - updatedAt: 更新日時でのソート
 */
export const ArticleSchema: SchemaDefinition<Article> = {
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
