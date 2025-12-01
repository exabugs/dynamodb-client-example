---
inclusion: always
---

# shadow.config.json 配置場所の修正

## 問題の原因

前回のセッションで `shadow.config.json` の配置場所を間違えた原因：

1. **古い情報がステアリングファイルに残っていた**
   - `shadow-config-generation.md` に「プロジェクトルートの `config/shadow.config.json` に出力」と記載
   - 実際には `packages/api-types/shadow.config.json` に出力されるべき

2. **CLI ツール移行後の更新漏れ**
   - `@exabugs/dynamodb-client` の CLI ツールに移行した際、ステアリングファイルが更新されていなかった
   - 古いスクリプトベースの情報が残っていた

## 実施した修正

### 1. shadow-config-generation.md の更新

両プロジェクト（`kiro-ainews`, `dynamodb-client-example`）で以下を修正：

- ✅ 正しい配置場所を明記: `packages/api-types/shadow.config.json`
- ✅ CLI ツールの使用方法を追加
- ✅ 古い `config/shadow.config.json` パスの記述を削除

### 2. structure.md の更新

両プロジェクトで以下を修正：

- ✅ シャドウ設定の配置場所を明記: `packages/api-types/shadow.config.json`
- ✅ CLI ツールによる自動生成を明記
- ✅ 古い `config/` ディレクトリの記述を削除

### 3. 再発防止策

このドキュメント（`shadow-config-location-fix.md`）を作成し、以下を記録：

- ✅ 問題の原因分析
- ✅ 実施した修正内容
- ✅ 正しい配置場所の明確化

## 正しい配置場所（重要）

### ファイル配置

```
packages/api-types/
├── src/
│   ├── schema.ts          # スキーマ定義（Single Source of Truth）
│   └── models/
│       ├── Article.ts
│       └── Task.ts
├── dist/
│   └── schema.js          # コンパイル済みスキーマ
├── shadow.config.json     # ← ここに生成される（重要！）
└── package.json
```

### 間違った配置（使用しない）

```
config/
└── shadow.config.json     # ← 古い配置場所、使用しない
```

## ビルドプロセス

```bash
cd packages/api-types
pnpm build
```

実行内容：
1. `tsc` でコンパイル → `dist/schema.js` 生成
2. `generate-shadow-config dist/schema.js` 実行
3. `packages/api-types/shadow.config.json` 生成

## チェックリスト

今後、shadow.config.json を扱う際は以下を確認：

- [ ] 配置場所は `packages/api-types/shadow.config.json` か？
- [ ] `config/shadow.config.json` を参照していないか？
- [ ] ステアリングファイルの情報は最新か？

## 参考

- [shadow-config-generation.md](./shadow-config-generation.md) - 詳細な生成手順
- [structure.md](./structure.md) - プロジェクト構造
