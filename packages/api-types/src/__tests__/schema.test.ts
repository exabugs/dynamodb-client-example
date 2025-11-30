/**
 * スキーマ定義のテスト
 */
import { describe, expect, it } from 'vitest';

import { ArticleSchema } from '../models/Article.js';
import { TaskSchema } from '../models/Task.js';
import { SchemaRegistryConfig } from '../schema.js';

describe('Articleスキーマの検証', () => {
  it('リソース名が正しい', () => {
    expect(ArticleSchema.resource).toBe('articles');
  });

  it('ソート可能フィールドが定義されている', () => {
    const sortableFields = Object.keys(ArticleSchema.shadows.sortableFields);
    expect(sortableFields).toContain('title');
    expect(sortableFields).toContain('status');
    expect(sortableFields).toContain('author');
    expect(sortableFields).toContain('createdAt');
    expect(sortableFields).toContain('updatedAt');
  });

  it('各フィールドに型が定義されている', () => {
    expect(ArticleSchema.shadows.sortableFields.title.type).toBe('string');
    expect(ArticleSchema.shadows.sortableFields.status.type).toBe('string');
    expect(ArticleSchema.shadows.sortableFields.author.type).toBe('string');
    expect(ArticleSchema.shadows.sortableFields.createdAt.type).toBe('datetime');
    expect(ArticleSchema.shadows.sortableFields.updatedAt.type).toBe('datetime');
  });
});

describe('Taskスキーマの検証', () => {
  it('リソース名が正しい', () => {
    expect(TaskSchema.resource).toBe('tasks');
  });

  it('ソート可能フィールドが定義されている', () => {
    const sortableFields = Object.keys(TaskSchema.shadows.sortableFields);
    expect(sortableFields).toContain('title');
    expect(sortableFields).toContain('status');
    expect(sortableFields).toContain('priority');
    expect(sortableFields).toContain('dueDate');
    expect(sortableFields).toContain('createdAt');
    expect(sortableFields).toContain('updatedAt');
  });

  it('各フィールドに型が定義されている', () => {
    expect(TaskSchema.shadows.sortableFields.title.type).toBe('string');
    expect(TaskSchema.shadows.sortableFields.status.type).toBe('string');
    expect(TaskSchema.shadows.sortableFields.priority.type).toBe('string');
    expect(TaskSchema.shadows.sortableFields.dueDate.type).toBe('datetime');
    expect(TaskSchema.shadows.sortableFields.createdAt.type).toBe('datetime');
    expect(TaskSchema.shadows.sortableFields.updatedAt.type).toBe('datetime');
  });
});

describe('SchemaRegistryConfigの検証', () => {
  it('データベース名が正しい', () => {
    expect(SchemaRegistryConfig.database.name).toBe('example');
  });

  it('タイムスタンプ設定が正しい', () => {
    expect(SchemaRegistryConfig.database.timestamps).toBeDefined();
    expect(SchemaRegistryConfig.database.timestamps?.createdAt).toBe('createdAt');
    expect(SchemaRegistryConfig.database.timestamps?.updatedAt).toBe('updatedAt');
  });

  it('リソースが登録されている', () => {
    expect(SchemaRegistryConfig.resources).toHaveProperty('articles');
    expect(SchemaRegistryConfig.resources).toHaveProperty('tasks');
  });

  it('登録されたリソースが正しいスキーマを参照している', () => {
    expect(SchemaRegistryConfig.resources.articles).toBe(ArticleSchema);
    expect(SchemaRegistryConfig.resources.tasks).toBe(TaskSchema);
  });
});
