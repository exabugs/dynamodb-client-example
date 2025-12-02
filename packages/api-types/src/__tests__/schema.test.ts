/**
 * スキーマ定義のテスト
 *
 * @exabugs/dynamodb-client v0.3.0+ では、シャドウレコードは自動生成されます。
 * このテストは型定義とリソース名の検証のみを行います。
 */
import { describe, expect, it } from 'vitest';

import { ARTICLE_RESOURCE, type Article } from '../models/Article.js';
import { TASK_RESOURCE, type Task } from '../models/Task.js';
import { RESOURCES, type ResourceName, type ResourceTypeMap } from '../schema.js';

describe('Articleリソースの検証', () => {
  it('リソース名が正しい', () => {
    expect(ARTICLE_RESOURCE).toBe('articles');
  });

  it('型定義が存在する', () => {
    // 型チェックのみ（コンパイル時に検証される）
    const _article: Article = {
      id: 'test',
      title: 'Test',
      content: 'Test content',
      status: 'draft',
      author: 'Test Author',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(_article).toBeDefined();
  });
});

describe('Taskリソースの検証', () => {
  it('リソース名が正しい', () => {
    expect(TASK_RESOURCE).toBe('tasks');
  });

  it('型定義が存在する', () => {
    // 型チェックのみ（コンパイル時に検証される）
    const _task: Task = {
      id: 'test',
      title: 'Test',
      description: 'Test description',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(_task).toBeDefined();
  });
});

describe('RESOURCESレジストリの検証', () => {
  it('すべてのリソースが登録されている', () => {
    expect(RESOURCES).toHaveProperty('articles');
    expect(RESOURCES).toHaveProperty('tasks');
  });

  it('ResourceName型が正しく推論される', () => {
    // 型チェックのみ（コンパイル時に検証される）
    const _resourceName: ResourceName = 'articles';
    expect(_resourceName).toBe('articles');
  });

  it('ResourceTypeMap型が正しく推論される', () => {
    // 型チェックのみ（コンパイル時に検証される）
    type ArticleType = ResourceTypeMap['articles'];
    type TaskType = ResourceTypeMap['tasks'];

    const _article: ArticleType = {
      id: 'test',
      title: 'Test',
      content: 'Test content',
      status: 'draft',
      author: 'Test Author',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const _task: TaskType = {
      id: 'test',
      title: 'Test',
      description: 'Test description',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(_article).toBeDefined();
    expect(_task).toBeDefined();
  });
});
