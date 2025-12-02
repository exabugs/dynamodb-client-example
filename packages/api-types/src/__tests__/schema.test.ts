/**
 * スキーマ定義のテスト
 *
 * @exabugs/dynamodb-client v0.3.x では、シャドウ設定は環境変数ベースになりました。
 * このテストは型定義とリソース管理の検証のみを行います。
 */
import { describe, expect, it } from 'vitest';

import { ArticleSchema } from '../models/Article.js';
import { TaskSchema } from '../models/Task.js';

describe('Articleスキーマの検証', () => {
  it('リソース名が正しい', () => {
    expect(ArticleSchema.resource).toBe('articles');
  });

  it('型定義が存在する', () => {
    expect(ArticleSchema.type).toBeDefined();
  });
});

describe('Taskスキーマの検証', () => {
  it('リソース名が正しい', () => {
    expect(TaskSchema.resource).toBe('tasks');
  });

  it('型定義が存在する', () => {
    expect(TaskSchema.type).toBeDefined();
  });
});
