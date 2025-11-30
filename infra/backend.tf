# Terraform Backend設定
# S3バックエンドを使用してTerraform状態を管理

terraform {
  backend "s3" {
    # S3バケット名（事前に作成が必要）
    # 例: example-tfstate-us
    bucket = "example-tfstate-us"

    # 状態ファイルのキー
    key = "example/terraform.tfstate"

    # AWSリージョン
    region = "us-east-1"

    # 状態ファイルの暗号化を有効化
    encrypt = true

    # DynamoDBテーブル名（状態ロック用、オプション）
    # 複数人での同時実行や CI/CD を使用する場合のみ必要
    # 個人開発の場合はコメントアウト可能
    # dynamodb_table = "example-tfstate-lock"
  }
}
