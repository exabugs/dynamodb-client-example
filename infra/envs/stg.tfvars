# Staging環境固有の設定

project_name       = "example"
environment        = "stg"
region             = "us-east-1"
enable_pitr        = true
log_retention_days = 14

# Cognito設定（Staging環境）
# 本番環境用のドメインを設定してください
admin_callback_urls = [
  "http://localhost:3000",
  "http://localhost:3000/callback",
  "https://admin-stg.example.com",
  "https://admin-stg.example.com/callback"
]

admin_logout_urls = [
  "http://localhost:3000",
  "http://localhost:3000/logout",
  "https://admin-stg.example.com",
  "https://admin-stg.example.com/logout"
]

# Lambda Records設定（Staging環境）
lambda_records_log_level = "info"
