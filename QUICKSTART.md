# Quick Start Guide

このテンプレートを使用して、新しいDynamoDB + React Admin アプリケーションを素早く構築できます。

## 前提条件

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- AWS CLI (configured)
- Terraform >= 1.5.0
- AWS アカウント

## ステップ1: テンプレートを使用

### GitHub Template Repository として使用

1. GitHubで「Use this template」ボタンをクリック
2. 新しいリポジトリ名を入力
3. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
```

### または、直接クローン

```bash
git clone https://github.com/exabugs/dynamodb-client-example.git my-project
cd my-project
rm -rf .git
git init
```

## ステップ2: プロジェクトを初期化

初期化スクリプトを実行して、プロジェクト名を変更します：

```bash
./scripts/init-project.sh
```

プロンプトに従って入力：

- **Project name**: `my-app` (小文字、英数字、ハイフンのみ)
- **AWS region**: `us-east-1` (デフォルト) または任意のリージョン

スクリプトは以下を自動的に実行します：

- プロジェクト名を全ファイルで置換
- AWSリージョンを設定
- ビルド成果物をクリーンアップ

## ステップ3: 依存関係をインストール

```bash
make install
```

## ステップ4: リソースモデルをカスタマイズ（オプション）

デフォルトでは、`Articles`と`Tasks`リソースが含まれています。

### 新しいリソースを追加

1. モデル定義を作成：

```bash
# packages/api-types/src/models/YourResource.ts
```

2. スキーマレジストリに登録：

```bash
# packages/api-types/src/schema.ts
```

3. react-adminリソースを作成：

```bash
# apps/admin/src/resources/yourResources.tsx
```

詳細は[shadow-config-generation.md](.kiro/steering/shadow-config-generation.md)を参照してください。

## ステップ5: インフラをデプロイ

### Terraformを初期化

```bash
cd infra
terraform init
cd ..
```

### dev環境にデプロイ

```bash
make deploy-dev
```

これにより以下がデプロイされます：

- DynamoDB Single-Table
- Cognito User Pool
- Records Lambda (HTTP API)
- 必要なIAMロール

## ステップ6: 環境変数を生成

Terraform outputから環境変数を自動生成：

```bash
make env-admin ENV=dev
```

生成されるファイル：

- `apps/admin/.env.development`

## ステップ7: 開発サーバーを起動

```bash
make dev-admin
```

ブラウザで http://localhost:3000 にアクセス

## ステップ8: Cognitoユーザーを作成

初回ログインには、Cognitoユーザーを作成する必要があります：

```bash
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --message-action SUPPRESS
```

`YOUR_USER_POOL_ID`は以下で確認：

```bash
cd infra
terraform output cognito_user_pool_id
```

## 次のステップ

### リソースを追加

1. `packages/api-types/src/models/`に新しいモデルを追加
2. `packages/api-types/src/schema.ts`にスキーマを登録
3. `make shadow-config`でshadow.config.jsonを再生成
4. `apps/admin/src/resources/`にreact-adminリソースを追加
5. `apps/admin/src/App.tsx`にリソースを登録

### 他の環境にデプロイ

```bash
# ステージング環境
make deploy-stg
make env-admin ENV=stg

# 本番環境
make deploy-prd
make env-admin ENV=prd
```

### Point-in-Time Recovery (PITR) を有効化

本番環境では必ずPITRを有効化してください：

```bash
# infra/envs/prd.tfvars
enable_pitr = true
```

## トラブルシューティング

### ポート3000が使用中

```bash
lsof -ti:3000 | xargs kill -9
```

### Cognitoログインエラー

1. ブラウザのローカルストレージをクリア
2. `apps/admin/.env.development`の設定を確認
3. Cognitoコールバック/ログアウトURLを確認（`infra/envs/dev.tfvars`）

### Terraformエラー

```bash
cd infra
terraform init -upgrade
make plan ENV=dev
```

## 便利なコマンド

```bash
# ヘルプを表示
make help

# ビルド
make build

# テスト実行
make test

# Lint実行
make lint

# フォーマット
make format

# クリーンアップ
make clean

# shadow.config.jsonを再生成
make shadow-config

# Terraform状態を確認
make infra-status
```

## ドキュメント

- [README.md](README.md) - プロジェクト概要
- [Makefile運用ガイドライン](.kiro/steering/makefile-operations.md)
- [シャドウ設定の自動生成](.kiro/steering/shadow-config-generation.md)
- [テストガイドライン](.kiro/steering/testing.md)
- [セキュリティ原則](.kiro/steering/security.md)

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。
