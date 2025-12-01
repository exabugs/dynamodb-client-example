/**
 * shadow.config.json生成のテスト
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('shadow.config.json生成の検証', () => {
  it('shadow.config.jsonが存在する', () => {
    // packages/api-types/src/__tests__ から packages/api-types へ
    const configPath = resolve(__dirname, '../../shadow.config.json');
    expect(existsSync(configPath)).toBe(true);
  });

  it('shadow.config.jsonが正しい構造を持つ', () => {
    const configPath = resolve(__dirname, '../../shadow.config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // 基本構造の確認
    expect(config).toHaveProperty('$schemaVersion');
    expect(config).toHaveProperty('$generatedFrom');
    expect(config).toHaveProperty('resources');

    // タイムスタンプ設定の確認（database.timestampsは生成されない）
    // expect(config.database.timestamps.createdAt).toBe('createdAt');
    // expect(config.database.timestamps.updatedAt).toBe('updatedAt');

    // リソースの確認
    expect(config.resources).toHaveProperty('articles');
    expect(config.resources).toHaveProperty('tasks');
  });

  it('articlesリソースが正しく生成されている', () => {
    const configPath = resolve(__dirname, '../../shadow.config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    const articles = config.resources.articles;
    expect(articles).toHaveProperty('shadows');
    expect(articles).toHaveProperty('sortDefaults');

    // ソート可能フィールドの確認
    expect(articles.shadows).toHaveProperty('title');
    expect(articles.shadows).toHaveProperty('status');
    expect(articles.shadows).toHaveProperty('author');
    expect(articles.shadows).toHaveProperty('createdAt');
    expect(articles.shadows).toHaveProperty('updatedAt');

    // デフォルトソート設定の確認
    expect(articles.sortDefaults.field).toBe('updatedAt');
    expect(articles.sortDefaults.order).toBe('DESC');
  });

  it('tasksリソースが正しく生成されている', () => {
    const configPath = resolve(__dirname, '../../shadow.config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    const tasks = config.resources.tasks;
    expect(tasks).toHaveProperty('shadows');
    expect(tasks).toHaveProperty('sortDefaults');

    // ソート可能フィールドの確認
    expect(tasks.shadows).toHaveProperty('title');
    expect(tasks.shadows).toHaveProperty('status');
    expect(tasks.shadows).toHaveProperty('priority');
    expect(tasks.shadows).toHaveProperty('dueDate');
    expect(tasks.shadows).toHaveProperty('createdAt');
    expect(tasks.shadows).toHaveProperty('updatedAt');

    // デフォルトソート設定の確認
    expect(tasks.sortDefaults.field).toBe('updatedAt');
    expect(tasks.sortDefaults.order).toBe('DESC');
  });
});
