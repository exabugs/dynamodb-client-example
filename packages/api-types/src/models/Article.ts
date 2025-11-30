/**
 * Article リソースの型定義とスキーマ定義
 */
import { SchemaDefinition, ShadowFieldType } from '../schema.js';
import type { ArticleStatus } from '../types.js';

/**
 * Article リソースの型定義
 */
export interface Article {
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
      title: { type: 'string' as ShadowFieldType.String },
      status: { type: 'string' as ShadowFieldType.String },
      author: { type: 'string' as ShadowFieldType.String },
      createdAt: { type: 'datetime' as ShadowFieldType.Datetime },
      updatedAt: { type: 'datetime' as ShadowFieldType.Datetime },
    },
  },
};
