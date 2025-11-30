# Dev環境固有の設定

project_name       = "example"
environment        = "dev"
region             = "us-east-1"
enable_pitr        = false
log_retention_days = 7

# Cognito設定（Dev環境）
admin_callback_urls = [
  "http://localhost:3000",
  "http://localhost:3000/callback"
]

admin_logout_urls = [
  "http://localhost:3000",
  "http://localhost:3000/login",
  "http://localhost:3000/logout"
]

# Lambda Records設定（Dev環境）
lambda_records_log_level = "debug"
