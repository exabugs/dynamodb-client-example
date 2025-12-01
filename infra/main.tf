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
# npmパッケージからTerraformモジュールを参照
module "lambda_records" {
  source = "../node_modules/@exabugs/dynamodb-client/terraform"

  project_name = var.project_name
  environment  = var.environment
  region       = var.region

  # DynamoDB設定（DynamoDBモジュールの出力を使用）
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Cognito設定（Cognitoモジュールの出力を使用）
  cognito_user_pool_id = module.cognito.user_pool_id

  # シャドウ設定（base64エンコード）
  shadow_config = filebase64("${path.root}/../packages/api-types/shadow.config.json")

  # ログ設定
  log_retention_days = var.log_retention_days
  log_level          = var.lambda_records_log_level
}
