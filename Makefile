.PHONY: help install build test lint format clean deploy-dev deploy-stg deploy-prd infra-plan infra-apply infra-status dev-admin shadow-config

# デフォルト環境
ENV ?= dev
REGION ?= us-east-1

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
	@echo "=== その他 ==="
	@echo "  make shadow-config     - shadow.config.jsonを再生成"
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
# その他
# ========================================

shadow-config:
	@echo "Regenerating shadow.config.json..."
	@$(MAKE) -C packages/api-types build
	@echo "✓ shadow.config.json regenerated"
