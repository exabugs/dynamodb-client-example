.PHONY: help install build test lint format clean deploy-dev deploy-stg deploy-prd infra-plan infra-apply infra-status dev-admin shadow-config

# デフォルト環境
ENV ?= dev
REGION ?= us-east-1

# Vite環境モードのマッピング
VITE_MODE_dev = development
VITE_MODE_stg = staging
VITE_MODE_prd = production

# デフォルトターゲット
help:
	@echo "DynamoDB Client Example - Root Makefile"
	@echo ""
	@echo "=== 開発コマンド ==="
	@echo "  make install           - 依存関係をインストール (pnpm install)"
	@echo "  make build             - 全パッケージをビルド"
	@echo "  make test              - 全パッケージのテストを実行（カバレッジ付き）"
	@echo "  make lint              - 全パッケージのLintを実行"
	@echo "  make format            - 全パッケージのフォーマットを実行"
	@echo "  make clean             - ビルド成果物を削除"
	@echo ""
	@echo "=== デプロイコマンド ==="
	@echo "  make deploy-dev        - dev環境にデプロイ (ビルド + Terraform apply)"
	@echo "  make deploy-stg        - stg環境にデプロイ (ビルド + Terraform apply)"
	@echo "  make deploy-prd        - prd環境にデプロイ (ビルド + Terraform apply)"
	@echo ""
	@echo "=== インフラコマンド ==="
	@echo "  make infra-plan        - Terraformプランを表示 [ENV=dev]"
	@echo "  make infra-apply       - Terraformを適用 [ENV=dev]"
	@echo "  make infra-status      - Terraform状態を表示"
	@echo ""
	@echo "=== 開発サーバー ==="
	@echo "  make dev-admin         - Admin UIの開発サーバーを起動"
	@echo ""
	@echo "=== 環境設定 ==="
	@echo "  make env-admin         - apps/admin/.env.{development|staging|production}を自動生成 [ENV=dev]"
	@echo ""
	@echo "環境変数:"
	@echo "  ENV=$(ENV)       - 環境 (dev/stg/prd)"
	@echo "  REGION=$(REGION) - AWSリージョン"

# ========================================
# 開発コマンド
# ========================================

install:
	@echo "Installing dependencies..."
	pnpm install

# パッケージのビルド順序（依存関係順）
build: build-packages build-apps

build-packages:
	@echo "Building shared packages..."
	@$(MAKE) -C packages/api-types build

build-apps:
	@echo "Building applications..."
	@pnpm --filter "@example/admin" build

test:
	@echo "Running tests with coverage..."
	pnpm -r test

lint:
	@echo "Running lint..."
	pnpm lint

format:
	@echo "Running format..."
	pnpm format

clean: clean-apps clean-packages
	@echo "All build artifacts cleaned"

clean-packages:
	@echo "Cleaning shared packages..."
	@$(MAKE) -C packages/api-types clean

clean-apps:
	@echo "Cleaning applications..."
	@pnpm --filter "@example/admin" clean || true

# ========================================
# デプロイコマンド
# ========================================

deploy-dev: build
	@echo "Deploying to dev environment..."
	@cd infra && make apply-auto ENV=dev

deploy-stg: build
	@echo "Deploying to stg environment..."
	@cd infra && make apply ENV=stg

deploy-prd: build
	@echo "⚠️  Deploying to PRODUCTION environment..."
	@cd infra && make apply ENV=prd

# ========================================
# インフラコマンド
# ========================================

infra-plan:
	@cd infra && make plan ENV=$(ENV)

infra-apply:
	@cd infra && make apply ENV=$(ENV)

infra-status:
	@cd infra && make status

# ========================================
# 開発サーバー
# ========================================

dev-admin:
	@echo "Starting Admin UI development server..."
	@pnpm --filter "@example/admin" dev

# ========================================
# 環境設定
# ========================================

env-admin:
	@echo "Generating apps/admin/.env.$(VITE_MODE_$(ENV)) from Terraform outputs (ENV=$(ENV))..."
	@if ! cd infra && terraform workspace select $(ENV) > /dev/null 2>&1; then \
		echo "❌ Error: Terraform workspace '$(ENV)' not found or not initialized"; \
		echo "   Run: cd infra && make init-workspaces"; \
		exit 1; \
	fi
	@if ! cd infra && terraform output lambda_records_function_url > /dev/null 2>&1; then \
		echo "❌ Error: Terraform outputs not available"; \
		echo "   Run: make deploy-$(ENV)"; \
		exit 1; \
	fi
	@echo "# Auto-generated from Terraform outputs (ENV=$(ENV))" > apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "# Generated at: $$(date)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "# Records Lambda Function URL" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_RECORDS_API_URL=$$(cd infra && terraform output -raw lambda_records_function_url)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "# Cognito User Pool設定" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_USER_POOL_ID=$$(cd infra && terraform output -raw cognito_user_pool_id)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_USER_POOL_CLIENT_ID=$$(cd infra && terraform output -raw cognito_admin_ui_client_id)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_DOMAIN=$$(cd infra && terraform output -raw cognito_user_pool_domain)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_REGION=$(REGION)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "✓ Generated apps/admin/.env.$(VITE_MODE_$(ENV)) for $(ENV) environment"
	@echo "✓ Vite will automatically use this file in $(VITE_MODE_$(ENV)) mode"

# ========================================
# その他
# ========================================

shadow-config:
	@echo "⚠️  shadow.config.json generation is no longer needed in v0.3.0+"
	@echo "Shadow records are now automatically generated based on record fields"
	@echo "See: https://github.com/exabugs/dynamodb-client#auto-shadow-generation"
