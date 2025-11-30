# Terraform変数定義

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックスとして使用）"
  type        = string
  default     = "example"
}

variable "environment" {
  description = "環境識別子（dev, stg, prd）"
  type        = string

  validation {
    condition     = contains(["dev", "stg", "prd"], var.environment)
    error_message = "環境は dev, stg, prd のいずれかである必要があります。"
  }
}

variable "region" {
  description = "AWSリージョン"
  type        = string
  default     = "us-east-1"
}

variable "enable_pitr" {
  description = "DynamoDB Point-in-Time Recoveryを有効化するかどうか"
  type        = bool
  default     = false
}

variable "log_retention_days" {
  description = "CloudWatch Logsの保持期間（日数）"
  type        = number
  default     = 7

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653], var.log_retention_days)
    error_message = "CloudWatch Logsの保持期間は有効な値である必要があります。"
  }
}

# Cognito設定

variable "admin_callback_urls" {
  description = "Admin UI用コールバックURLのリスト"
  type        = list(string)
  default = [
    "http://localhost:3000",
    "http://localhost:3000/callback"
  ]
}

variable "admin_logout_urls" {
  description = "Admin UI用ログアウトURLのリスト"
  type        = list(string)
  default = [
    "http://localhost:3000",
    "http://localhost:3000/logout"
  ]
}

# Lambda Records設定

variable "lambda_records_log_level" {
  description = "Records Lambdaのログレベル（debug, info, warn, error）"
  type        = string
  default     = "info"

  validation {
    condition     = contains(["debug", "info", "warn", "error"], var.lambda_records_log_level)
    error_message = "ログレベルは debug, info, warn, error のいずれかである必要があります。"
  }
}
