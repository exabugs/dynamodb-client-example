# Implementation Plan

## 概要

このタスクリストは、`dynamodb-client-example` プロジェクトの実装手順を定義します。kiro-ainewsの実績あるコードベースをベースに、不要な機能を削除し、最小限かつ完全なワーキング例として再構成します。

## 実装方針

1. **kiro-ainewsをベースにする**: 動作実績のあるコードから開始
2. **削除する機能**: fetch Lambda、maintenance Lambda、mobile app
3. **残す機能**: packages/api-types、apps/admin、infra（Records Lambda含む）
4. **リソース**: Article と Task の2つ
5. **Terraform**: workspace不使用、.tfvars管理

## タスクリスト

- [x] 1. プロジェクト基盤のセットアップ
  - ルート設定ファイルの作成（package.json、pnpm-workspace.yaml、tsconfig.base.json）
  - 開発ツール設定（ESLint、Prettier、Vitest）
  - Makefile作成（共通操作コマンド）
  - 環境変数テンプレート（.envrc.example）
  - _Requirements: 1.1, 1.6, 1.8, 1.9, 1.10_

- [x] 2. packages/api-types の実装
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 2.1 型定義の作成（Single Source of Truth）
  - `src/types.ts` を作成
  - ArticleStatus 型定義（string literal union: 'draft' | 'published' | 'archived'）
  - TaskStatus 型定義（string literal union: 'todo' | 'in_progress' | 'done'）
  - TaskPriority 型定義（string literal union: 'low' | 'medium' | 'high'）
  - 選択肢定義（ARTICLE_STATUS_CHOICES, TASK_STATUS_CHOICES, TASK_PRIORITY_CHOICES）
  - **重要**: enum は使用せず、軽量で tree-shakeable な string literal union を使用
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Article型定義とスキーマの作成
  - `src/models/Article.ts` を作成
  - Article interface定義（id, title, content, status: ArticleStatus, author, createdAt, updatedAt）
  - ArticleSchema定義（sortableFields: title, status, author, createdAt, updatedAt）
  - `import type { ArticleStatus } from '../types.js'` で型をインポート
  - _Requirements: 2.1, 2.4_

- [x] 2.3 Task型定義とスキーマの作成
  - `src/models/Task.ts` を作成
  - Task interface定義（id, title, description, status: TaskStatus, priority: TaskPriority, dueDate, createdAt, updatedAt）
  - TaskSchema定義（sortableFields: title, status, priority, dueDate, createdAt, updatedAt）
  - `import type { TaskStatus, TaskPriority } from '../types.js'` で型をインポート
  - _Requirements: 2.2, 2.4_

- [x] 2.4 SchemaRegistryConfigの作成
  - `src/schema.ts` を作成
  - database設定（name, timestamps）
  - resources設定（articles, tasks）
  - _Requirements: 2.3, 2.5_

- [x] 2.5 shadow.config.json生成スクリプトの作成
  - `src/scripts/generate-shadow-config.ts` を作成
  - SchemaRegistryConfigから shadow.config.json を生成
  - packages/api-types/ 直下に出力
  - _Requirements: 2.3, 2.7_

- [x] 2.6 index.tsでのエクスポート
  - `src/index.ts` を作成
  - すべての型、スキーマ、選択肢定義をエクスポート
  - Admin UIから `import { Article, Task, ARTICLE_STATUS_CHOICES, TASK_STATUS_CHOICES, TASK_PRIORITY_CHOICES } from '@example/api-types'` で参照可能にする
  - _Requirements: 2.6_

- [x] 2.7 package.json とビルド設定
  - package.json作成（name: @example/api-types）
  - build script: `tsc && node dist/scripts/generate-shadow-config.js`
  - tsconfig.json作成
  - _Requirements: 2.3, 2.6_

- [x] 2.8 単体テストの作成
  - 型定義の検証テスト（ArticleStatus, TaskStatus, TaskPriorityの型チェック）
  - 選択肢定義の検証テスト（CHOICES配列の構造確認）
  - スキーマ定義の検証テスト（Article, Taskのフィールド確認）
  - shadow.config.json生成の検証テスト（ファイル存在確認、基本構造確認）
  - シンプルなテストのみ実装
  - _Requirements: 8.1, 8.2_

- [x] 3. infra（Terraform）の実装
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 3.1 Terraform基本設定
  - `main.tf`, `variables.tf`, `outputs.tf` を作成
  - provider設定（AWS）
  - backend設定（S3 + DynamoDB）
  - _Requirements: 4.1_

- [x] 3.2 DynamoDBモジュールの作成
  - `modules/dynamodb/main.tf` を作成
  - Single-Table設計（PK: resource, SK: id or shadow key）
  - TTL設定、Point-in-Time Recovery設定
  - _Requirements: 4.2_

- [x] 3.3 Cognitoモジュールの作成
  - `modules/cognito/main.tf` を作成
  - User Pool設定（email認証、パスワードポリシー）
  - App Client設定（PKCE有効化、OAuth設定）
  - Hosted UI設定
  - _Requirements: 4.3_

- [x] 3.4 Records Lambda設定
  - `@exabugs/dynamodb-client` Terraformモジュールを参照
  - shadow_config設定（filebase64で packages/api-types/shadow.config.json を参照）
  - DynamoDB、Cognito設定を渡す
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.4_

- [x] 3.5 環境別設定ファイルの作成
  - `envs/dev.tfvars`, `envs/stg.tfvars`, `envs/prd.tfvars` を作成
  - project_name, environment, region設定
  - admin_callback_urls, admin_logout_urls設定
  - _Requirements: 4.1, 4.6_

- [x] 3.6 outputs設定
  - function_url, cognito_user_pool_id, cognito_client_id, cognito_domain を出力
  - _Requirements: 4.5_

- [x] 4. apps/admin（React + react-admin）の実装
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 4.1 プロジェクト基盤のセットアップ
  - Vite + React + TypeScript プロジェクト作成
  - package.json設定（name: @example/admin）
  - 依存関係追加（react-admin, @exabugs/dynamodb-client, react-oidc-context）
  - vite.config.ts設定（port: 3000, strictPort: true）
  - _Requirements: 5.1_

- [x] 4.2 authProviderの実装
  - `src/authProvider.ts` を作成
  - Cognito Hosted UI + PKCE認証フロー
  - login, logout, checkAuth, checkError, getIdentity実装
  - _Requirements: 5.2_

- [x] 4.3 dataProviderの実装
  - `src/dataProvider.ts` を作成
  - DynamoClient初期化（@exabugs/dynamodb-client/client/cognito）
  - createDataProvider使用（@exabugs/dynamodb-client/integrations/react-admin）
  - _Requirements: 5.5_

- [x] 4.4 Articlesリソースの実装
  - `src/resources/articles.tsx` を作成
  - ArticleList, ArticleCreate, ArticleEdit, ArticleShow コンポーネント
  - フィールド: title, content, status, author
  - **重要**: `ARTICLE_STATUS_CHOICES` を `@example/api-types` からインポート
  - 選択肢は直接 `ARTICLE_STATUS_CHOICES` を使用（Single Source of Truth）
  - ソート、フィルター機能
  - _Requirements: 5.3_

- [x] 4.5 Tasksリソースの実装
  - `src/resources/tasks.tsx` を作成
  - TaskList, TaskCreate, TaskEdit, TaskShow コンポーネント
  - フィールド: title, description, status, priority, dueDate
  - **重要**: `TASK_STATUS_CHOICES`, `TASK_PRIORITY_CHOICES` を `@example/api-types` からインポート
  - 選択肢は直接 `*_CHOICES` を使用（Single Source of Truth）
  - ソート、フィルター機能
  - _Requirements: 5.4_

- [x] 4.6 App.tsxの実装
  - `src/App.tsx` を作成
  - Admin コンポーネント設定
  - Resource登録（articles, tasks）
  - BrowserRouter使用（HashRouter不使用）
  - _Requirements: 5.1_

- [x] 4.7 環境変数設定
  - `.env.example` を作成
  - VITE_FUNCTION_URL, VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID, VITE_COGNITO_DOMAIN, VITE_AWS_REGION
  - _Requirements: 6.2_

- [ ] 5. ドキュメントの作成
  - _Requirements: 6.1, 6.5, 6.6_

- [ ] 5.1 READMEの作成
  - プロジェクト概要
  - 技術スタック
  - セットアップ手順（依存関係インストール、環境変数設定、ビルド、デプロイ）
  - Makefileコマンド一覧
  - ディレクトリ構成
  - トラブルシューティング
  - _Requirements: 6.1, 6.5, 6.6_

- [ ] 5.2 .envrc.exampleの作成
  - AWS認証情報のプレースホルダー
  - AWS_PROFILE, AWS_REGION設定例
  - 秘匿情報を含まない
  - _Requirements: 6.2, 10.6, 10.7_

- [x] 6. Makefileの実装
  - _Requirements: 6.4, 6.8, 6.9, 6.10_

- [x] 6.1 開発コマンドの実装
  - `make install`: pnpm install
  - `make build`: pnpm -r build（packages/api-types → apps/admin）
  - `make test`: pnpm -r test
  - `make lint`: pnpm -r lint
  - `make format`: pnpm format
  - `make clean`: pnpm -r clean
  - _Requirements: 6.4, 6.8_

- [x] 6.2 インフラコマンドの実装
  - `make infra-plan ENV=dev`: terraform plan -var-file=envs/dev.tfvars
  - `make infra-apply ENV=dev`: terraform apply -var-file=envs/dev.tfvars
  - `make infra-status`: terraform workspace show, terraform state list
  - _Requirements: 6.10_

- [x] 6.3 デプロイコマンドの実装
  - `make deploy-dev`: make build && make infra-apply ENV=dev
  - `make deploy-stg`: make build && make infra-apply ENV=stg
  - `make deploy-prd`: make build && make infra-apply ENV=prd
  - _Requirements: 9.1_

- [x] 6.4 ヘルプコマンドの実装
  - `make help`: 利用可能なコマンド一覧を表示
  - _Requirements: 6.9_

- [ ] 7. 公開リポジトリ対応
  - _Requirements: 10.6, 10.7, 10.8, 10.9, 10.10_

- [ ] 7.1 .gitignoreの作成
  - .envrc, .env, .env.local
  - *.tfstate, *.tfstate.backup, .terraform/
  - node_modules/, dist/, coverage/
  - _Requirements: 10.6_

- [ ] 7.2 秘匿情報の除外確認
  - AWS account IDsをプレースホルダーに置換（123456789012）
  - ドメイン名をexample.comに置換
  - 実際のAPI keys, tokensが含まれていないことを確認
  - _Requirements: 10.6, 10.7, 10.8, 10.9_

- [ ] 7.3 git履歴のクリーンアップ
  - 秘匿情報が過去のコミットに含まれていないことを確認
  - 必要に応じてgit filter-branchで削除
  - _Requirements: 10.10_

- [ ] 8. 最終チェックポイント
  - すべてのテストが通過することを確認
  - ユーザーに質問があれば確認

- [ ] 8.1 ビルドとテストの実行
  - `make clean && make build`
  - `make test`
  - `make lint`
  - すべてのコマンドが成功することを確認

- [ ] 8.2 Terraformデプロイの確認
  - `make infra-plan ENV=dev`
  - エラーがないことを確認

- [ ] 8.3 Admin UI起動の確認
  - `pnpm --filter @example/admin dev`
  - http://localhost:3000 にアクセス
  - ログイン画面が表示されることを確認

- [ ] 8.4 ドキュメントの最終確認
  - README.mdが完全であることを確認
  - .envrc.exampleが正しいことを確認
  - すべての手順が実行可能であることを確認
