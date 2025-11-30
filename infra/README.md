# Terraform Infrastructure

DynamoDB Client Exampleのインフラストラクチャコード

## 前提条件

### 0. AWS認証情報の設定（direnv）

direnvを使用してAWS認証情報を管理します：

```bash
# direnvのインストール（未インストールの場合）
brew install direnv

# シェル設定に追加（~/.zshrc）
eval "$(direnv hook zsh)"

# プロジェクトルートに移動
cd /path/to/dynamodb-client-example

# .envrc.exampleをコピーして編集
cp .envrc.example .envrc
# エディタで.envrcを開いてAWS認証情報を設定

# direnvを許可
direnv allow .
```

**認証方法の選択肢：**

1. **AWS SSO（推奨）**

   ```bash
   # .envrc
   export AWS_PROFILE="your-sso-profile"
   ```

2. **IAMロール（推奨）**

   ```bash
   # .envrc
   export AWS_PROFILE="your-profile-with-role"
   ```

3. **IAMユーザーのアクセスキー（非推奨）**
   ```bash
   # .envrc
   export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
   export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
   export AWS_DEFAULT_REGION="us-east-1"
   ```

**⚠️ セキュリティ注意事項:**

- `.envrc`ファイルはプロジェクトルートに配置し、`.gitignore`で除外されています
- アクセスキーを使用する場合は定期的にローテーションしてください
- 可能な限りAWS SSOまたはIAMロールを使用してください
- `.envrc`に`TF_VAR_environment`を設定しないでください（ワークスペースで管理）
- direnvはプロジェクトルートで有効化されるため、`infra/`ディレクトリでも自動的に環境変数が読み込まれます

### 1. S3バケットの作成

Terraform状態ファイルを保存するためのS3バケットを事前に作成する必要があります：

```bash
aws s3api create-bucket \
  --bucket example-tfstate-us \
  --region us-east-1

# バージョニングを有効化
aws s3api put-bucket-versioning \
  --bucket example-tfstate-us \
  --versioning-configuration Status=Enabled

# 暗号化を有効化
aws s3api put-bucket-encryption \
  --bucket example-tfstate-us \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# パブリックアクセスをブロック
aws s3api put-public-access-block \
  --bucket example-tfstate-us \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### 2. DynamoDBテーブルの作成（オプション）

**複数人での開発やCI/CDを使用する場合のみ必要です。個人開発では不要です。**

状態ロック用のDynamoDBテーブルを作成する場合：

```bash
aws dynamodb create-table \
  --table-name example-tfstate-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

作成した場合は、`backend.tf`の`dynamodb_table`行のコメントを解除してください。

## ディレクトリ構造

```
infra/
├── backend.tf           # S3バックエンド設定
├── providers.tf         # AWS Provider設定
├── variables.tf         # 変数定義
├── terraform.tfvars     # デフォルト変数値
├── envs/                # 環境固有の設定
│   ├── dev.tfvars
│   ├── stg.tfvars
│   └── prd.tfvars
├── main.tf              # メインリソース定義（今後追加）
└── modules/             # 再利用可能なモジュール（今後追加）
```

## 使用方法

### クイックスタート（推奨）

Makefileを使用すると、環境管理が簡単になります：

```bash
cd infra

# 初回のみ: ワークスペースを初期化
make init-workspaces

# 現在の状態を確認
make status

# Dev環境のプランを確認
make plan ENV=dev

# Dev環境に変更を適用
make apply ENV=dev

# Staging環境にデプロイ
make plan ENV=stg
make apply ENV=stg

# Production環境にデプロイ
make plan ENV=prd
make apply ENV=prd
```

### 手動での使用方法

Makefileを使わない場合は、以下の手順で実行できます：

```bash
cd infra

# 初回のみ: Terraformを初期化
terraform init

# 初回のみ: ワークスペースを作成
terraform workspace new dev
terraform workspace new stg
terraform workspace new prd

# 環境を切り替え
terraform workspace select dev

# プランを確認
terraform plan -var-file="envs/dev.tfvars"

# 変更を適用
terraform apply -var-file="envs/dev.tfvars"
```

**⚠️ 重要**: defaultワークスペースでの実行は禁止されています。必ずdev/stg/prdのいずれかに切り替えてください。

## バックエンド設定

### S3バックエンド

- **バケット名**: `example-tfstate-us`
- **リージョン**: `us-east-1`
- **暗号化**: 有効
- **キー**: `example/terraform.tfstate`

### 状態ロック（オプション）

複数人での開発やCI/CDを使用する場合、DynamoDBテーブル `example-tfstate-lock` を使用して、複数の実行による競合を防ぐことができます。個人開発では不要です。

## 環境変数

各環境で以下の変数をカスタマイズできます：

| 変数               | Dev   | Staging | Production | 説明                          |
| ------------------ | ----- | ------- | ---------- | ----------------------------- |
| environment        | dev   | stg     | prd        | 環境識別子                    |
| enable_pitr        | false | true    | true       | DynamoDB PITR有効化           |
| log_retention_days | 7     | 14      | 30         | CloudWatch Logs保持期間（日） |

## モジュール

### DynamoDB (`modules/dynamodb`)

- **機能**: Single-Table設計、TTL、PITR、KMS暗号化
- **テーブル名**: `example-{env}-records`
- **キー構造**: PK（リソース名）、SK（レコードIDまたはシャドーキー）
- **詳細**: [modules/dynamodb/README.md](modules/dynamodb/README.md)

### Cognito (`modules/cognito`)

- **機能**: User Pool、User Pool Client、Hosted UI Domain
- **User Pool名**: `example-{env}-userpool`
- **Domain**: `example-{env}-auth`

## トラブルシューティング

### defaultワークスペースで実行してしまった場合

誤ってdefaultワークスペースでリソースを作成してしまった場合：

1. **バックアップを作成**

   ```bash
   terraform workspace select default
   terraform state pull > backup-default-$(date +%Y%m%d-%H%M%S).json
   aws s3 cp s3://ainews-tfstate-us/terraform.tfstate \
             s3://ainews-tfstate-us/terraform.tfstate.backup-$(date +%Y%m%d-%H%M%S)
   ```

2. **dev環境に移行**

   ```bash
   terraform workspace select dev
   aws s3 cp s3://ainews-tfstate-us/terraform.tfstate \
             s3://ainews-tfstate-us/env:/dev/terraform.tfstate
   terraform init -reconfigure
   terraform plan -var-file="envs/dev.tfvars"
   ```

3. **defaultをクリーンアップ**
   ```bash
   terraform workspace select default
   # 状態が空であることを確認
   terraform state list
   # S3のdefault状態ファイルを削除
   aws s3 rm s3://ainews-tfstate-us/terraform.tfstate
   ```

### ワークスペース切り替えを忘れた場合

現在のワークスペースを確認：

```bash
make status
# または
terraform workspace show
```

エラーメッセージが表示された場合は、指示に従って環境を切り替えてください。

### 状態ファイルの不整合

予期しない差分が表示される場合：

```bash
terraform refresh -var-file="envs/dev.tfvars"
terraform plan -var-file="envs/dev.tfvars"
```

## ベストプラクティス

1. **常にMakefileを使用する**
   - `make plan ENV=dev`で環境切り替えとプランを一度に実行
   - ワークスペース切り替え忘れを防止

2. **作業前に現在の環境を確認**

   ```bash
   make status
   ```

3. **本番環境への適用は慎重に**
   - 必ずstg環境で検証してからprd環境にデプロイ
   - `make plan ENV=prd`で差分を十分に確認

4. **定期的なバックアップ**
   - 重要な変更前には状態ファイルをバックアップ
   - S3のバージョニングが有効なので、誤削除からの復旧が可能

## CORS設定

### Lambda Function URL CORS設定

Records Lambda Function URLのCORS設定は `modules/api/lambda-records/main.tf` で管理されています：

```hcl
resource "aws_lambda_function_url" "records" {
  cors {
    allow_origins     = ["*"]  # 本番環境では特定のドメインに制限
    allow_methods     = ["POST"]
    allow_headers     = ["content-type", "authorization", "x-amz-date", "x-api-key", "x-amz-security-token"]
    expose_headers    = ["content-type", "x-amzn-requestid"]
    allow_credentials = false
    max_age           = 86400  # 24時間
  }
}
```

**重要**: Lambda Function URLのCORS設定を使用するため、Lambda関数のハンドラーではCORSヘッダーを設定しません。両方で設定するとヘッダーが重複してCORSエラーが発生します。

### 開発環境のコールバックURL

開発環境（dev）では、ローカル開発用のコールバック/ログアウトURLが設定されています（`envs/dev.tfvars`）：

```hcl
admin_callback_urls = [
  "http://localhost:3000",
  "http://localhost:3000/callback",
  "http://localhost:5173",
  "http://localhost:5173/callback"
]

admin_logout_urls = [
  "http://localhost:3000",
  "http://localhost:3000/login",
  "http://localhost:5173",
  "http://localhost:5173/login",
  "http://localhost:5173/logout"
]
```

**注意**: Admin UIの開発サーバーはポート3000で固定されています（`apps/admin/vite.config.ts`で`strictPort: true`を設定）。

## デプロイ済みリソース

1. ✅ Terraform backend設定（完了）
2. ✅ DynamoDB Single-Table（完了）
3. ✅ Cognito User Pool + Hosted UI（完了）
4. ✅ Records Lambda（`@exabugs/dynamodb-client`から提供）（完了）
5. ✅ Lambda Function URL + CORS設定（完了）
