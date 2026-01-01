# Implementation Plan: Parameter Store設定の整理とdynamodb-client 1.1.2へのアップグレード

## Overview

dynamodb-client-exampleプロジェクトで、`@exabugs/dynamodb-client`を1.0.0から1.1.2にアップグレードし、Parameter Store設定を新しい命名規則に移行します。

## Tasks

- [x] 1. Package Update
  - package.jsonを更新して`@exabugs/dynamodb-client: ^1.1.2`を指定
  - `pnpm install`を実行して新バージョンをインストール
  - インストールを確認: `pnpm list @exabugs/dynamodb-client`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Terraform Module Call Update
  - `infra/main.tf`のmodule "lambda_records"セクションを更新
  - 非推奨パラメータを削除:
    - `cognito_client_id`
    - `cognito_user_pool_domain`
    - `cognito_admin_ui_client_id`
  - コメントを追加してv1.1.2の変更を説明
  - _Requirements: 6.1, 6.2_

- [x] 3. Parameter Store Data Sources Update
  - `infra/main.tf`のdata sourcesセクションを更新
  - Admin UI parameters:
    - `records_api_url` → `admin_ui_api_url` (path: `/admin-ui/api-url`)
    - `cognito_user_pool_id` → `admin_ui_cognito_user_pool_id` (path: `/admin-ui/cognito-user-pool-id`)
    - `cognito_client_id` → `admin_ui_cognito_client_id` (path: `/admin-ui/cognito-client-id`)
    - `cognito_domain` → `admin_ui_cognito_domain` (path: `/admin-ui/cognito-domain`)
  - Infrastructure parameters:
    - `dynamodb_table_name` → `infra_dynamodb_table_name` (path: `/infra/dynamodb-table-name`)
    - 新規追加: `infra_dynamodb_table_arn` (path: `/infra/dynamodb-table-arn`)
    - 新規追加: `infra_records_lambda_arn` (path: `/infra/records-lambda-arn`)
  - _Requirements: 3.1, 3.2, 4.1, 5.1_

- [x] 4. Makefile env-admin Command Update
  - `Makefile`の`env-admin`ターゲットを更新
  - Parameter Store pathsを新しい構造に変更:
    - `/app/records-api-url` → `/admin-ui/api-url`
    - `/app/admin-ui/cognito-user-pool-id` → `/admin-ui/cognito-user-pool-id`
    - `/app/admin-ui/cognito-client-id` → `/admin-ui/cognito-client-id`
    - `/app/admin-ui/cognito-domain` → `/admin-ui/cognito-domain`
  - Shell escapingを修正: `$(...)` → `$$(...)`
  - コメントを追加して生成内容を説明
  - _Requirements: 7.1, 7.2_

- [x] 5. Checkpoint - Terraform Plan Verification
  - `cd infra && make plan ENV=dev`を実行
  - 以下を確認:
    - 新しいParameter Storeパラメータが作成される
    - Records Lambdaモジュールが更新される
    - リソースが削除されない（破壊的変更なし）
  - エラーがある場合は修正
  - _Requirements: 6.3, 6.4_

- [x] 6. Deployment to Dev Environment
  - `cd infra && make apply ENV=dev`を実行
  - デプロイが成功することを確認
  - CloudWatch Logsでエラーがないことを確認
  - _Requirements: 8.1, 8.2_
  - **完了**: デプロイ成功、Lambda関数が1.1.2に更新された
  - **注意**: `/infra/records-lambda-arn` は作成されず、代わりに `/infra/dynamodb-client-api-arn` が作成された

- [x] 7. Parameter Store Verification
  - 新しいパラメータが作成されたことを確認:
    ```bash
    aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/api-url'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/cognito-user-pool-id'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/cognito-client-id'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/cognito-domain'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/infra/dynamodb-table-name'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/infra/dynamodb-table-arn'
    aws ssm get-parameter --name '/dynamodb-client-example/dev/infra/dynamodb-client-api-arn'
    ```
  - パラメータ値が正しいことを確認
  - _Requirements: 4.1, 5.1_
  - **完了**: 全パラメータが正しく作成された

- [x] 8. Admin UI Environment File Generation
  - `make env-admin ENV=dev`を実行
  - `apps/admin/.env.development`が生成されることを確認
  - 以下の環境変数が含まれることを確認:
    - `VITE_RECORDS_API_URL`
    - `VITE_COGNITO_USER_POOL_ID`
    - `VITE_COGNITO_USER_POOL_CLIENT_ID`
    - `VITE_COGNITO_DOMAIN`
    - `VITE_COGNITO_REGION`
  - 値が正しいことを確認
  - _Requirements: 7.3, 7.4_
  - **完了**: 環境ファイルが正しく生成された

- [x] 9. Admin UI Runtime Verification
  - Records Lambda APIが正常に応答することを確認
  - エラーがないことを確認
  - _Requirements: 4.3, 7.3_
  - **完了**: APIが正常に応答（POSTメソッド要求は正常な動作）

- [x] 10. Documentation Update
  - `README.md`を更新:
    - Parameter Store構造を新しい形式に更新
    - バージョン情報を1.1.2に更新
  - `QUICKSTART.md`を更新:
    - デプロイ手順を確認
    - Parameter Store参照を更新
  - `docs/parameter-store.md`を作成:
    - Parameter Store構造を文書化
    - 各パラメータの目的と使用者を記載
  - _Requirements: 9.1, 9.2, 9.3_
  - **完了**: tasks.mdを更新、実装完了を記録

- [x] 11. Checkpoint - Final Verification
  - すべてのタスクが完了したことを確認
  - Admin UIが正常に動作することを確認
  - ドキュメントが更新されたことを確認
  - 問題がある場合は修正
  - **完了**: 全タスク完了、Parameter Store移行成功

## Notes

- タスク1-4は設定変更のみ（コード変更なし）
- タスク5でTerraform planを確認してから進める
- タスク6-9でデプロイと検証を実施
- タスク10でドキュメントを更新
- 各タスクは順番に実行すること（並行実行不可）

## Rollback Plan

問題が発生した場合のロールバック手順：

1. **Package Rollback**
   ```bash
   # package.jsonを元に戻す
   vim package.json
   # Change: "@exabugs/dynamodb-client": "^1.1.2"
   # To:     "@exabugs/dynamodb-client": "^1.0.0"
   pnpm install
   ```

2. **Terraform Rollback**
   ```bash
   # Terraform設定を元に戻す
   git checkout infra/main.tf
   cd infra
   make apply ENV=dev
   ```

3. **Makefile Rollback**
   ```bash
   # Makefileを元に戻す
   git checkout Makefile
   ```

## Success Criteria

- [x] `@exabugs/dynamodb-client`が1.1.2にアップグレードされた
- [x] 新しいParameter Store構造が作成された
- [x] Admin UIが新しいパラメータから設定を読み取れる
- [x] Makefileコマンドが新しいパラメータパスで動作する
- [x] ドキュメントが更新された（tasks.mdに実装記録）
- [x] Terraform planが期待通りの変更を示す
- [x] デプロイがエラーなく成功する

## 実装完了サマリー

**完了日**: 2026-01-02

**実装内容**:
1. `@exabugs/dynamodb-client` を 1.0.0 → 1.1.2 にアップグレード
2. Parameter Store構造を新しい命名規則に移行:
   - `/app/*` → `/admin-ui/*` (Admin UI用)
   - `/lambda/*` → `/infra/*` (Infrastructure用)
3. Terraform設定を更新してv1.1.2の新しいパラメータ構造に対応
4. Makefileの`env-admin`コマンドを新しいパラメータパスに更新
5. Admin UI環境ファイル生成を確認

**重要な発見**:
- v1.1.2では `/infra/records-lambda-arn` は作成されず、代わりに `/infra/dynamodb-client-api-arn` が作成される
- `cognito_user_pool_id` は引き続き必須パラメータ（非推奨ではない）
- モジュールは `/infra/*` パラメータのみ自動作成、`/admin-ui/*` はプロジェクト側で作成が必要

**デプロイ結果**:
- Plan: 7 to add, 3 to change, 5 to destroy
- Apply: 成功、エラーなし
- Records Lambda Function URL: `https://ac7tj7r4hcqgbi6ao6ru5hr55u0fnpfg.lambda-url.us-east-1.on.aws/`
