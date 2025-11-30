# Terraform出力

# DynamoDB
output "dynamodb_table_name" {
  description = "DynamoDBテーブル名"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "DynamoDBテーブルARN"
  value       = module.dynamodb.table_arn
}

# Cognito
output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = module.cognito.user_pool_arn
}

output "cognito_user_pool_domain" {
  description = "Cognito User Pool ドメイン（Hosted UI用）"
  value       = module.cognito.user_pool_domain
}

output "cognito_hosted_ui_url" {
  description = "Cognito Hosted UI URL"
  value       = module.cognito.hosted_ui_url
}

output "cognito_admin_ui_client_id" {
  description = "Admin UI用Cognito User Pool Client ID"
  value       = module.cognito.admin_ui_client_id
}

# Records Lambda
output "lambda_records_function_name" {
  description = "Records Lambda関数名"
  value       = module.lambda_records.function_name
}

output "lambda_records_function_arn" {
  description = "Records Lambda関数ARN"
  value       = module.lambda_records.function_arn
}

output "lambda_records_function_url" {
  description = "Records Lambda Function URL（HTTPSエンドポイント）"
  value       = module.lambda_records.function_url
}

output "lambda_records_role_arn" {
  description = "Records Lambda実行ロールARN"
  value       = module.lambda_records.role_arn
}

output "lambda_records_log_group_name" {
  description = "Records Lambda CloudWatch Logsロググループ名"
  value       = module.lambda_records.log_group_name
}
