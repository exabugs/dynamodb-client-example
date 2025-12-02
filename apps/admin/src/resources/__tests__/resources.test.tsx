/**
 * リソース整合性テスト
 *
 * TypeScript ASTを使ってreact-adminリソース定義を静的解析し、
 * 型定義との整合性を自動検証します。
 *
 * @exabugs/dynamodb-client v0.3.0+ では、リソース名定数を使用します。
 */
import path from 'path';
import { describe } from 'vitest';

import {
  extractFieldsFromInterface,
  testRecordRepresentation,
  testResourceConstantMatch,
  testResourceName,
  testSourceIntegrity,
} from './helpers/resourceIntegrity';

/**
 * リソース定義
 */
interface ResourceDefinition {
  resourceFile: string; // リソースファイル名（例: 'articles.tsx'）
  typeFile: string; // 型定義ファイル名（例: 'Article.ts'）
}

/**
 * テスト対象のリソース一覧
 *
 * 新しいリソースを追加する場合は、ここに追加してください。
 * テストは自動的に以下を検証します：
 * - 型定義ファイルからインターフェース名を導出（Article.ts → Article）
 * - リソース名定数を自動生成（Article → ARTICLE_RESOURCE）
 * - リソース名定数とリソースファイルのnameが一致
 * - source属性が型定義に存在
 * - recordRepresentationが型定義に存在
 */
const resources: ResourceDefinition[] = [
  { resourceFile: 'articles.tsx', typeFile: 'Article.ts' },
  { resourceFile: 'tasks.tsx', typeFile: 'Task.ts' },
];

/**
 * 各リソースに対してテストを実行
 */
resources.forEach(({ resourceFile, typeFile }) => {
  // ファイル名からインターフェース名を導出（Article.ts → Article）
  const interfaceName = path.basename(typeFile, '.ts');

  // リソース名定数を生成（Article → ARTICLE_RESOURCE）
  const constantName = `${interfaceName.toUpperCase()}_RESOURCE`;

  // リソース名を生成（Article → articles）
  const resourceName = resourceFile.replace('.tsx', '');

  describe(`${interfaceName} Resource`, () => {
    const resourceFilePath = path.join(__dirname, '..', resourceFile);
    const typeFilePath = path.join(
      __dirname,
      '../../../../../packages/api-types/src/models',
      typeFile
    );

    // 型定義からフィールド一覧を抽出
    const typeFields = extractFieldsFromInterface(typeFilePath, interfaceName);

    // テスト実行
    testResourceName(resourceFilePath, resourceName);
    testResourceConstantMatch(resourceFilePath, typeFilePath, constantName);
    testSourceIntegrity(resourceFilePath, typeFields, resourceName);
    testRecordRepresentation(resourceFilePath, typeFields, resourceName);
  });
});
