.PHONY: help check-env plan apply apply-auto status destroy

# デフォルト環境
ENV ?= dev

# デフォルトターゲット
help:
	@echo "Terraform Management (tfvars-based)"
	@echo ""
	@echo "Usage:"
	@echo "  make plan [ENV=<dev|stg|prd>]   - 環境のプランを表示 (デフォルト: dev)"
	@echo "  make apply [ENV=<dev|stg|prd>]  - 環境に変更を適用 (デフォルト: dev)"
	@echo "  make apply-auto [ENV=<dev|stg|prd>] - 環境に変更を適用（自動承認）"
	@echo "  make status                      - 現在の状態を表示"
	@echo ""
	@echo "Examples:"
	@echo "  make plan           # dev環境でプラン実行"
	@echo "  make plan ENV=stg   # stg環境でプラン実行"
	@echo "  make apply          # dev環境に適用"
	@echo "  make status         # 現在の状態を表示"

# 環境変数の検証
check-env:
	@if [ "$(ENV)" != "dev" ] && [ "$(ENV)" != "stg" ] && [ "$(ENV)" != "prd" ]; then \
		echo "Error: ENV must be dev, stg, or prd (got: $(ENV))"; \
		exit 1; \
	fi

# プラン実行
plan: check-env
	@echo "Running plan for $(ENV) environment..."
	@terraform plan -var-file="envs/$(ENV).tfvars"

# 適用
apply: check-env
	@echo "Applying changes for $(ENV) environment..."
	@terraform apply -var-file="envs/$(ENV).tfvars"

# 自動承認で適用
apply-auto: check-env
	@echo "Applying changes for $(ENV) environment (auto-approve)..."
	@terraform apply -auto-approve -var-file="envs/$(ENV).tfvars"

# 破棄（慎重に使用）
destroy: check-env
	@echo "⚠️  WARNING: This will destroy all resources in $(ENV) environment!"
	@terraform destroy -var-file="envs/$(ENV).tfvars"

# 現在の状態表示
status:
	@echo "Terraform State:"
	@echo ""
	@echo "Resources:"
	@terraform state list 2>/dev/null || echo "  (no resources)"
