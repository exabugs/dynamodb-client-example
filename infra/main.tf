# メインリソース定義

# DynamoDB Single-Table
module "dynamodb" {
  source = "./modules/dynamodb"

  project_name = var.project_name
  environment  = var.environment
  enable_pitr  = var.enable_pitr
}

# Cognito User Pool
module "cognito" {
  source = "./modules/cognito"

  project_name = var.project_name
  environment  = var.environment

  # MFA設定（本番環境では有効化推奨）
  enable_mfa = var.environment == "prd" ? true : false

  # 削除保護（本番環境では有効化推奨）
  enable_deletion_protection = var.environment == "prd" ? true : false

  # Admin UI用コールバックURL（環境変数で上書き可能）
  admin_callback_urls = var.admin_callback_urls
  admin_logout_urls   = var.admin_logout_urls
}

# Records Lambda（HTTP API）
# @exabugs/dynamodb-client のTerraformモジュールを使用
# 
# 注意: node_modulesから参照しています
# - pnpm installでパッケージがインストールされている必要があります
# - CI/CDでは terraform init 前に pnpm install を実行してください
# - バージョンは package.json で管理されます
#
# v1.1.2の変更点:
# - cognito_client_id, cognito_user_pool_domain, cognito_admin_ui_client_id は非推奨
# - cognito_user_pool_id は引き続き必須（Parameter Store書き込みに使用）
module "lambda_records" {
  source = "../node_modules/@exabugs/dynamodb-client/terraform"

  project_name = var.project_name
  environment  = var.environment
  region       = var.region

  # DynamoDB設定（DynamoDBモジュールの出力を使用）
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Cognito設定
  cognito_user_pool_id = module.cognito.user_pool_id

  # シャドウ設定（環境変数ベース）
  # デフォルト値を使用（createdAt, updatedAt, 100バイト, 15桁パディング）
  # 必要に応じてカスタマイズ可能
  # shadow_created_at_field  = "createdAt"
  # shadow_updated_at_field  = "updatedAt"
  # shadow_string_max_bytes  = 100
  # shadow_number_padding    = 15

  # ログ設定
  log_retention_days = var.log_retention_days
  log_level          = var.lambda_records_log_level
}

# Parameter Store から設定値を読み取る（data source）
# Infrastructure parametersのみ（Admin UI parametersはresourceで作成）

# Infrastructure Parameters
data "aws_ssm_parameter" "infra_dynamodb_client_api_url" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-client-api-url"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "infra_dynamodb_table_name" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-table-name"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "infra_dynamodb_table_arn" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-table-arn"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "infra_dynamodb_client_api_arn" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-client-api-arn"
  depends_on = [module.lambda_records]
}

# Admin UI用Parameter Store設定
# dynamodb-clientモジュールは/infra/配下のみ作成するため、
# /admin-ui/配下はプロジェクト側で作成する

resource "aws_ssm_parameter" "admin_ui_api_url" {
  name      = "/${var.project_name}/${var.environment}/admin-ui/api-url"
  type      = "SecureString"
  tier      = "Standard"
  value     = data.aws_ssm_parameter.infra_dynamodb_client_api_url.value
  overwrite = true

  description = "Admin UI用Records Lambda API URL"

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Category    = "admin-ui"
  }

  depends_on = [module.lambda_records, data.aws_ssm_parameter.infra_dynamodb_client_api_url]
}

resource "aws_ssm_parameter" "admin_ui_cognito_user_pool_id" {
  name      = "/${var.project_name}/${var.environment}/admin-ui/cognito-user-pool-id"
  type      = "SecureString"
  tier      = "Standard"
  value     = module.cognito.user_pool_id
  overwrite = true

  description = "Admin UI用Cognito User Pool ID"

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Category    = "admin-ui"
  }
}

resource "aws_ssm_parameter" "admin_ui_cognito_client_id" {
  name      = "/${var.project_name}/${var.environment}/admin-ui/cognito-client-id"
  type      = "SecureString"
  tier      = "Standard"
  value     = module.cognito.admin_ui_client_id
  overwrite = true

  description = "Admin UI用Cognito Client ID"

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Category    = "admin-ui"
  }
}

resource "aws_ssm_parameter" "admin_ui_cognito_domain" {
  name      = "/${var.project_name}/${var.environment}/admin-ui/cognito-domain"
  type      = "SecureString"
  tier      = "Standard"
  value     = module.cognito.user_pool_domain
  overwrite = true

  description = "Admin UI用Cognito Domain"

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Category    = "admin-ui"
  }
}
