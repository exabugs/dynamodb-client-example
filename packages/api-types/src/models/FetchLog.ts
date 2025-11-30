import { SchemaDefinition } from '../schema.js';

/**
 * Fetch実行履歴
 * ニュース取得の実行結果を記録
 */
export interface FetchLog {
  /** レコードID（ULID） */
  id: string;

  /** 名前（プロバイダー名と同じ） */
  name: string;

  /** プロバイダ名（newsapi、gnews、apitube） */
  provider: 'newsapi' | 'gnews' | 'apitube';

  /** 実行ステータス */
  status: 'success' | 'partial' | 'failure';

  /** 新規追加件数（insertMany成功） */
  fetchedCount: number;

  /** 重複件数（既存記事） */
  duplicateCount: number;

  /** エラー件数（重複を除く実際のエラー） */
  failedCount: number;

  /** エラーメッセージ（失敗時） */
  errorMessage?: string;

  /** 実行日時（ISO 8601形式） */
  executedAt: string;

  /** TTL（Unix timestamp、秒単位） */
  ttl?: number;

  /** レコード作成日時（自動設定） */
  createdAt: string;

  /** レコード更新日時（自動設定） */
  updatedAt: string;
}

/**
 * FetchLogスキーマ定義
 */
export const FetchLogSchema: SchemaDefinition<FetchLog> = {
  resource: 'fetchLogs',
  type: {} as FetchLog,
  shadows: {
    sortableFields: {
      name: { type: 'string' },
      provider: { type: 'string' },
      status: { type: 'string' },
      executedAt: { type: 'datetime' },
      createdAt: { type: 'datetime' },
      updatedAt: { type: 'datetime' },
    },
  },
  ttl: {
    days: 30, // 30日後に自動削除
  },
};
