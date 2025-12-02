# DynamoDB Client Example

Example project demonstrating `@exabugs/dynamodb-client` usage

> 💡 **このリポジトリをテンプレートとして使用できます！**  
> 新しいプロジェクトを始める場合は、[QUICKSTART.md](QUICKSTART.md)を参照してください。

## プロジェクト概要

`@exabugs/dynamodb-client`パッケージの使用例を示すプロジェクトです。DynamoDB Single-Table設計による動的シャドウ管理、Cognito認証、React管理画面を統合し、Articles と Tasks リソースのCRUD操作を実装しています。

**このリポジトリをテンプレートとして使用すれば、すぐにアプリケーション開発を始められます。**

## 技術スタック

- **モノレポ管理**: pnpm workspace
- **言語**: TypeScript, Node.js 22
- **インフラ**: AWS (DynamoDB, Lambda, Cognito)
- **IaC**: Terraform
- **フロントエンド**: React 19, react-admin 5, MUI 6
- **DynamoDB Client**: `@exabugs/dynamodb-client`
- **テスト**: Vitest
- **Lint/Format**: ESLint 9, Prettier

## 必要要件

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- AWS CLI (configured)
- Terraform >= 1.5.0

## セットアップ

```bash
# 依存関係のインストール
make install
# または
pnpm install

# Lint実行
make lint

# フォーマット
make format

# テスト実行
make test

# ビルド
make build
```

## Makefile操作

プロジェクトでは頻度の高い操作をMakefileで管理しています。

### 主要コマンド

```bash
# ヘルプを表示
make help

# 開発
make install    # 依存関係のインストール
make build      # 全パッケージとLambda関数のビルド
make test       # 全パッケージのテスト実行
make lint       # Lint実行
make format     # フォーマット実行
make clean      # ビルド成果物の削除

# デプロイ
make deploy-dev    # dev環境にデプロイ
make deploy-stg    # stg環境にデプロイ
make deploy-prd    # prd環境にデプロイ

# インフラ操作
make infra-plan ENV=dev     # Terraformプランを表示
make infra-apply ENV=dev    # Terraformを適用
make infra-status           # Terraform状態を表示

# 環境設定
make env-admin ENV=dev    # Admin UI環境変数を自動生成

# その他
make dev-admin        # Admin UI開発サーバー起動
```

### 個別Makefileの使用

Terraformには個別のMakefileも用意されています：

```bash
# Terraform
cd infra
make help
make plan ENV=dev
make apply ENV=dev
make status
```

詳細は[Makefile運用ガイドライン](.kiro/steering/makefile-operations.md)を参照してください。

## DynamoDB Client SDK

このプロジェクトは、独立した `@exabugs/dynamodb-client` パッケージを使用しています。

- **パッケージ**: `@exabugs/dynamodb-client`
- **リポジトリ**: `../dynamodb-client` (独立したプロジェクト)
- **機能**: DynamoDB Single-Table設計向けのクライアントSDK、MongoDB風API、Shadow Records、Lambda実装

詳細は[dynamodb-client/README.md](../dynamodb-client/README.md)を参照してください。

## ワークスペース構成

```
.
├── apps/           # アプリケーション
│   └── admin/      # Admin UI (React + react-admin)
├── packages/       # 共有ライブラリ
│   └── api-types/  # API型定義、スキーマレジストリ、shadow.config.json
├── scripts/        # ユーティリティスクリプト
└── infra/          # Terraform設定
```

**注**:

- `@exabugs/dynamodb-client` は独立したプロジェクトとして `../dynamodb-client` に配置されており、Records Lambda機能を提供しています
- v0.3.0以降、shadow.config.jsonは不要になりました（自動シャドー生成）

## Admin UI 開発・デプロイ

### ローカル開発

```bash
# 開発サーバー起動
make dev-admin

# または
pnpm --filter @example/admin dev

# ブラウザで http://localhost:3000 にアクセス
```

### 環境変数設定

環境変数ファイルは、Terraform outputから自動生成できます：

```bash
# dev環境の.env.developmentを生成
make env-admin ENV=dev

# stg環境の.env.stagingを生成
make env-admin ENV=stg

# prd環境の.env.productionを生成
make env-admin ENV=prd
```

生成される環境変数：

```bash
# Records Lambda Function URL
VITE_RECORDS_API_URL=https://xxxxx.lambda-url.us-east-1.on.aws/

# Cognito User Pool設定
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=example-dev-auth
VITE_COGNITO_REGION=us-east-1
```

Viteは自動的に適切な環境ファイルを読み込みます：

- `vite dev` → `.env.development`
- `vite build --mode staging` → `.env.staging`
- `vite build` → `.env.production`

### 重要な設定

**必須**: Admin UIは**BrowserRouter**を使用します。HashRouterは使用しないでください。

理由：

- Cognito Hosted UIの認証コールバックがクエリパラメータ（`?code=xxx`）を使用
- HashRouter（`#/`）ではクエリパラメータが正しく処理されない

### トラブルシューティング

#### Cognito Hosted UIでログインできない場合

1. **開発サーバーのポートを確認**: `http://localhost:3000` で起動していることを確認
   - Vite設定で `strictPort: true` が設定されているため、ポート3000が使用中の場合はエラーになります
   - 他のプロセスがポート3000を使用していないか確認してください

2. **Cognitoのコールバック/ログアウトURLを確認**: `infra/envs/dev.tfvars`

   ```hcl
   admin_callback_urls = [
     "http://localhost:3000",
     "http://localhost:3000/callback",
     ...
   ]
   ```

3. **ブラウザのローカルストレージをクリア**: 古いセッション情報が残っている可能性があります

## 実装されている機能

- **Articles リソース**: 記事のCRUD操作（タイトル、内容、ステータス、作成日時、更新日時）
- **Tasks リソース**: タスクのCRUD操作（タイトル、説明、ステータス、優先度、期限、作成日時、更新日時）
- **Cognito認証**: Hosted UIによるログイン/ログアウト
- **Shadow Records**: DynamoDBでのソート可能なフィールド管理
- **Lambda Function URL**: Records Lambda（`@exabugs/dynamodb-client`）

## ドキュメント

詳細な設計・要件については以下を参照してください：

- [要件定義書](.kiro/specs/dynamodb-client-example/requirements.md)
- [設計書](.kiro/specs/dynamodb-client-example/design.md)
- [実装タスクリスト](.kiro/specs/dynamodb-client-example/tasks.md)

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

Copyright (c) 2024 exabugs
