# Requirements Document

## Introduction

`dynamodb-client-example` は、`@exabugs/dynamodb-client` パッケージの完全なワーキング例として、開発者がQuickStartボイラープレートとして使用できるプロジェクトです。`kiro-ainews` の実績あるコードベースをベースに、ニュース配信特有の機能（fetch、maintenance）を削除し、汎用的な記事・タスク管理アプリケーションとして再構成します。

## 技術スタック

- **パッケージマネージャー**: pnpm >= 9.0.0
- **ランタイム**: Node.js >= 22.0.0
- **言語**: TypeScript 5.3.0+
- **モノレポ管理**: pnpm workspace
- **インフラ**: AWS (DynamoDB, Lambda, Cognito)
- **IaC**: Terraform >= 1.5.0
- **フロントエンド**: React 19, react-admin 5, Vite
- **テスト**: Vitest 2 with v8 coverage
- **Lint/Format**: ESLint 9 (flat config), Prettier 3 with @trivago/prettier-plugin-sort-imports

## Glossary

- **System**: `dynamodb-client-example` プロジェクト全体
- **Admin UI**: React + react-admin による管理画面
- **Records Lambda**: DynamoDB CRUD操作を提供するLambda関数（`@exabugs/dynamodb-client` パッケージに含まれる）
- **Article**: 管理対象の記事エンティティ（タイトル、コンテンツ、ステータス、著者を持つ）
- **Task**: 管理対象のタスクエンティティ（タイトル、説明、ステータス、優先度、期限を持つ）
- **Shadow Records**: DynamoDB Single-Table設計で効率的なソートを実現する仕組み
- **Schema Registry**: TypeScriptでリソーススキーマを定義する設定
- **Terraform**: インフラをコードで管理するIaCツール
- **Cognito**: AWS認証サービス
- **DynamoDB**: AWSのNoSQLデータベースサービス
- **Public Repository**: GitHubで公開されるリポジトリ（秘匿情報を含まない）

## Requirements

### Requirement 1: プロジェクト構成

**User Story:** As a developer, I want a minimal but complete monorepo structure, so that I can quickly start building my application without unnecessary complexity.

#### Acceptance Criteria

1. WHEN the System is initialized THEN the System SHALL provide a pnpm workspace configuration with necessary directories only
2. WHEN the System structure is reviewed THEN the System SHALL include packages/ (api-types with shadow.config.json), apps/ (admin), and infra/ (terraform without workspace)
3. WHEN the System structure is reviewed THEN the System SHALL exclude functions/ directory (Records Lambda is provided by @exabugs/dynamodb-client)
4. WHEN the System structure is reviewed THEN the System SHALL exclude separate config/ directory (shadow.config.json is generated in packages/api-types)
5. WHEN the System structure is designed THEN the System SHALL consider future expansion (e.g., additional apps, packages, or functions)
6. WHEN the System is built THEN the System SHALL compile all TypeScript code to JavaScript with type definitions
7. WHEN the System is tested THEN the System SHALL execute all unit tests with coverage reporting
8. WHEN the System is formatted THEN the System SHALL apply Prettier with import sorting plugin across all workspaces
9. WHEN the System is linted THEN the System SHALL check code quality with ESLint rules
10. WHEN the System configuration is reviewed THEN the System SHALL include prettier.config.cjs, .prettierignore, eslint.config.js, tsconfig.base.json, and vitest.config.ts at the root

### Requirement 2: API型定義とスキーマレジストリ

**User Story:** As a developer, I want TypeScript-based schema definitions for multiple resource types, so that I can maintain type safety and generate shadow configuration automatically.

#### Acceptance Criteria

1. WHEN an Article schema is defined THEN the System SHALL provide TypeScript interfaces with id, title, content, status, author, createdAt, and updatedAt fields
2. WHEN a Task schema is defined THEN the System SHALL provide TypeScript interfaces with id, title, description, status, priority, dueDate, createdAt, and updatedAt fields
3. WHEN the schema is built THEN the System SHALL generate shadow.config.json automatically from SchemaRegistryConfig in packages/api-types directory
4. WHEN sortable fields are specified THEN the System SHALL include title, status, createdAt, and updatedAt for both Article and Task
5. WHEN the schema version is updated THEN the System SHALL use semantic versioning (major.minor) in shadow.config.json
6. WHEN the schema is exported THEN the System SHALL provide all types and schemas from a single entry point
7. WHEN shadow.config.json is referenced THEN the System SHALL use packages/api-types/shadow.config.json from Admin UI and Terraform

### Requirement 3: Records Lambda関数

**User Story:** As a developer, I want a Lambda function that handles CRUD operations, so that I can interact with DynamoDB through a REST API.

#### Acceptance Criteria

1. WHEN the Records Lambda is deployed THEN the System SHALL use the pre-built handler from @exabugs/dynamodb-client/server/handler
2. WHEN the Records Lambda receives a request THEN the System SHALL authenticate using Cognito JWT tokens
3. WHEN the Records Lambda processes operations THEN the System SHALL support getList, getOne, getMany, getManyReference, create, update, updateMany, delete, and deleteMany
4. WHEN the Records Lambda creates or updates records THEN the System SHALL automatically generate shadow records for sortable fields
5. WHEN the Records Lambda is invoked THEN the System SHALL log operations with request IDs for debugging

### Requirement 4: Terraform インフラストラクチャ

**User Story:** As a developer, I want Infrastructure as Code with Terraform, so that I can deploy the entire stack to AWS with a single command.

#### Acceptance Criteria

1. WHEN Terraform is initialized THEN the System SHALL support multi-environment configuration using .tfvars files (dev, stg, prd) without using Terraform workspaces
2. WHEN Terraform is applied THEN the System SHALL create DynamoDB table with TTL and Point-in-Time Recovery enabled
3. WHEN Terraform is applied THEN the System SHALL create Cognito User Pool with email verification and MFA support
4. WHEN Terraform is applied THEN the System SHALL deploy Records Lambda using @exabugs/dynamodb-client Terraform module with Function URL and CORS configuration
5. WHEN Terraform outputs are requested THEN the System SHALL provide function_url, cognito_user_pool_id, cognito_client_id, and cognito_domain
6. WHEN Terraform is executed THEN the System SHALL use terraform plan -var-file=envs/dev.tfvars or make plan ENV=dev commands (not workspace select)

### Requirement 5: Admin UI (React + react-admin)

**User Story:** As a developer, I want a complete admin interface, so that I can manage articles and tasks through a web UI without writing additional code.

#### Acceptance Criteria

1. WHEN the Admin UI is started THEN the System SHALL use BrowserRouter (not HashRouter) for Cognito callback compatibility
2. WHEN the Admin UI authenticates THEN the System SHALL use Cognito Hosted UI with PKCE flow
3. WHEN the Admin UI displays articles THEN the System SHALL show List, Create, Edit, and Show views with sorting and filtering
4. WHEN the Admin UI displays tasks THEN the System SHALL show List, Create, Edit, and Show views with sorting and filtering
5. WHEN the Admin UI performs operations THEN the System SHALL use the DynamoDB Client data provider from @exabugs/dynamodb-client/integrations/react-admin
6. WHEN the Admin UI is built for production THEN the System SHALL generate optimized static files for CloudFront deployment

### Requirement 6: 開発者体験とMakefile

**User Story:** As a developer, I want excellent documentation and tooling with Makefile commands, so that I can understand and customize the example quickly.

#### Acceptance Criteria

1. WHEN the System is cloned THEN the System SHALL provide a comprehensive README with setup instructions
2. WHEN the System is configured THEN the System SHALL provide .envrc.example with all required environment variables (placeholder values only)
3. WHEN the System is configured for development THEN the System SHALL use root-level .envrc for AWS authentication (excluded from git)
4. WHEN the System is operated THEN the System SHALL provide Makefile commands for common operations (install, build, test, lint, format, clean, deploy, logs)
5. WHEN the System is deployed THEN the System SHALL provide step-by-step deployment guide in README
6. WHEN the System encounters errors THEN the System SHALL provide troubleshooting section in README
7. WHEN direnv is used THEN the System SHALL automatically load environment variables from .envrc when entering the directory
8. WHEN AI or developers execute operations THEN the System SHALL use make commands (not direct pnpm or terraform commands)
9. WHEN Makefile is reviewed THEN the System SHALL include make help command to display available commands
10. WHEN Terraform operations are performed THEN the System SHALL use make infra-plan, make infra-apply, make infra-status commands

### Requirement 7: シンプルさと保守性

**User Story:** As a developer, I want a minimal but complete example, so that I can understand the architecture without unnecessary complexity.

#### Acceptance Criteria

1. WHEN the System is reviewed THEN the System SHALL contain two resource types (Article and Task) to demonstrate multi-resource handling
2. WHEN the System is reviewed THEN the System SHALL exclude mobile app, fetch function, and maintenance functions
3. WHEN the System is reviewed THEN the System SHALL use the same proven patterns as kiro-ainews
4. WHEN the System is reviewed THEN the System SHALL include only essential dependencies
5. WHEN the System is reviewed THEN the System SHALL provide clear comments in Japanese for all configuration files

### Requirement 8: テストとコード品質

**User Story:** As a developer, I want automated tests and quality checks, so that I can ensure the example works correctly.

#### Acceptance Criteria

1. WHEN tests are executed THEN the System SHALL run unit tests for schema generation and type definitions
2. WHEN tests are executed THEN the System SHALL achieve at least 80% code coverage for packages
3. WHEN code is linted THEN the System SHALL enforce ESLint rules with maximum 0 warnings for new code
4. WHEN code is formatted THEN the System SHALL use Prettier with import sorting
5. WHEN CI/CD is configured THEN the System SHALL run tests, lint, and format checks on every commit

### Requirement 9: デプロイメントとモニタリング

**User Story:** As a developer, I want easy deployment and monitoring, so that I can run the example in production.

#### Acceptance Criteria

1. WHEN the System is deployed THEN the System SHALL support one-command deployment with `make deploy-dev`
2. WHEN the System is deployed THEN the System SHALL configure CloudWatch Logs for Lambda functions
3. WHEN the System is deployed THEN the System SHALL provide `make logs-records` command to view Lambda logs
4. WHEN the System is deployed THEN the System SHALL configure CloudWatch Alarms for error monitoring
5. WHEN the System is deployed THEN the System SHALL use ARM64 architecture for cost optimization

### Requirement 10: セキュリティと公開リポジトリ対応

**User Story:** As a developer, I want secure defaults and no sensitive information, so that the example can be safely published as a public repository.

#### Acceptance Criteria

1. WHEN IAM roles are created THEN the System SHALL follow the principle of least privilege
2. WHEN Cognito is configured THEN the System SHALL enforce strong password policies
3. WHEN Lambda Function URL is created THEN the System SHALL configure CORS with specific allowed origins
4. WHEN DynamoDB is accessed THEN the System SHALL use IAM roles (not access keys)
5. WHEN secrets are managed THEN the System SHALL use environment variables (not hardcoded values)
6. WHEN the repository is published THEN the System SHALL exclude all sensitive information (AWS account IDs, API keys, tokens, personal information)
7. WHEN environment variables are documented THEN the System SHALL provide .envrc.example with placeholder values (not real values)
8. WHEN Terraform is configured THEN the System SHALL use generic project names and avoid organization-specific identifiers
9. WHEN documentation is written THEN the System SHALL use example.com, placeholder domains, and generic AWS account IDs (123456789012)
10. WHEN git history is reviewed THEN the System SHALL ensure no sensitive information was ever committed
