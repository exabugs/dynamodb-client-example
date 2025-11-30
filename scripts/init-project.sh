#!/bin/bash
set -e

# プロジェクト初期化スクリプト
# このテンプレートから新しいプロジェクトを作成する際に使用

echo "🚀 DynamoDB Client Example - Project Initialization"
echo ""

# プロジェクト名の入力
read -p "Enter your project name (lowercase, alphanumeric, hyphens only): " PROJECT_NAME

# バリデーション
if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "❌ Error: Project name must be lowercase alphanumeric with hyphens only"
  exit 1
fi

if [ "$PROJECT_NAME" = "example" ]; then
  echo "❌ Error: Please choose a different name (not 'example')"
  exit 1
fi

# AWSリージョンの入力
read -p "Enter AWS region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

# 確認
echo ""
echo "Configuration:"
echo "  Project Name: $PROJECT_NAME"
echo "  AWS Region:   $AWS_REGION"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "🔄 Updating project files..."

# プロジェクト名を置換（Terraformファイル）
find infra -type f -name "*.tf" -exec sed -i '' "s/example/$PROJECT_NAME/g" {} +
find infra -type f -name "*.tfvars" -exec sed -i '' "s/example/$PROJECT_NAME/g" {} +

# プロジェクト名を置換（package.json）
find . -type f -name "package.json" -exec sed -i '' "s/@example/@$PROJECT_NAME/g" {} +
find . -type f -name "package.json" -exec sed -i '' "s/\"example\"/\"$PROJECT_NAME\"/g" {} +

# プロジェクト名を置換（TypeScript/JavaScript）
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec sed -i '' "s/@example/@$PROJECT_NAME/g" {} +
find apps -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec sed -i '' "s/@example/@$PROJECT_NAME/g" {} +

# データベース名を置換（schema.ts）
find packages/api-types/src -type f -name "schema.ts" -exec sed -i '' "s/name: 'example'/name: '$PROJECT_NAME'/g" {} +

# AWSリージョンを置換（Makefile）
sed -i '' "s/REGION ?= us-east-1/REGION ?= $AWS_REGION/g" Makefile
sed -i '' "s/REGION ?= us-east-1/REGION ?= $AWS_REGION/g" infra/Makefile

# README.mdを更新
sed -i '' "s/example-dev/$PROJECT_NAME-dev/g" README.md
sed -i '' "s/example-stg/$PROJECT_NAME-stg/g" README.md
sed -i '' "s/example-prd/$PROJECT_NAME-prd/g" README.md

echo "✓ Project files updated"
echo ""
echo "🧹 Cleaning up..."

# 既存のビルド成果物を削除
make clean 2>/dev/null || true

# node_modulesを削除（再インストールが必要）
rm -rf node_modules
find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true

# .envファイルを削除（再生成が必要）
find apps -type f -name ".env*" ! -name ".env.example" -exec rm -f {} +

echo "✓ Cleanup complete"
echo ""
echo "✅ Project initialized as '$PROJECT_NAME'"
echo ""
echo "📋 Next steps:"
echo ""
echo "  1. Install dependencies:"
echo "     make install"
echo ""
echo "  2. Build packages:"
echo "     make build"
echo ""
echo "  3. Initialize Terraform:"
echo "     cd infra && terraform init"
echo ""
echo "  4. Deploy to dev environment:"
echo "     make deploy-dev"
echo ""
echo "  5. Generate environment variables:"
echo "     make env-admin ENV=dev"
echo ""
echo "  6. Start development server:"
echo "     make dev-admin"
echo ""
echo "🎉 Happy coding!"
