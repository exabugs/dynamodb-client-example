/**
 * 型定義と選択肢定義のテスト
 */
import { describe, expect, it } from 'vitest';

import {
  ARTICLE_STATUS_CHOICES,
  type ArticleStatus,
  TASK_PRIORITY_CHOICES,
  TASK_STATUS_CHOICES,
  type TaskPriority,
  type TaskStatus,
} from '../types.js';

describe('型定義の検証', () => {
  it('ArticleStatus型が正しく定義されている', () => {
    const validStatuses: ArticleStatus[] = ['draft', 'published', 'archived'];
    expect(validStatuses).toHaveLength(3);
  });

  it('TaskStatus型が正しく定義されている', () => {
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
    expect(validStatuses).toHaveLength(3);
  });

  it('TaskPriority型が正しく定義されている', () => {
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];
    expect(validPriorities).toHaveLength(3);
  });
});

describe('選択肢定義の検証', () => {
  it('ARTICLE_STATUS_CHOICESが正しい構造を持つ', () => {
    expect(ARTICLE_STATUS_CHOICES).toHaveLength(3);
    expect(ARTICLE_STATUS_CHOICES[0]).toHaveProperty('id');
    expect(ARTICLE_STATUS_CHOICES[0]).toHaveProperty('name');
    expect(ARTICLE_STATUS_CHOICES[0].id).toBe('draft');
    expect(ARTICLE_STATUS_CHOICES[0].name).toBe('下書き');
  });

  it('TASK_STATUS_CHOICESが正しい構造を持つ', () => {
    expect(TASK_STATUS_CHOICES).toHaveLength(3);
    expect(TASK_STATUS_CHOICES[0]).toHaveProperty('id');
    expect(TASK_STATUS_CHOICES[0]).toHaveProperty('name');
    expect(TASK_STATUS_CHOICES[0].id).toBe('todo');
    expect(TASK_STATUS_CHOICES[0].name).toBe('未着手');
  });

  it('TASK_PRIORITY_CHOICESが正しい構造を持つ', () => {
    expect(TASK_PRIORITY_CHOICES).toHaveLength(3);
    expect(TASK_PRIORITY_CHOICES[0]).toHaveProperty('id');
    expect(TASK_PRIORITY_CHOICES[0]).toHaveProperty('name');
    expect(TASK_PRIORITY_CHOICES[0].id).toBe('low');
    expect(TASK_PRIORITY_CHOICES[0].name).toBe('低');
  });
});
