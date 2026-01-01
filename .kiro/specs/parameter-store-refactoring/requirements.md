# Requirements Document: Parameter Store設定の整理とdynamodb-client 1.1.2へのアップグレード

## Introduction

dynamodb-client-exampleプロジェクトで、`@exabugs/dynamodb-client`を1.0.0から1.1.2にアップグレードし、Parameter Store設定を新しい命名規則に移行します。asanowaプロジェクトで実施した整理と同様の作業を行います。

## Glossary

- **Parameter Store**: AWS Systems Manager Parameter Storeのこと
- **dynamodb-client**: `@exabugs/dynamodb-client`パッケージのTerraformモジュール
- **Records Lambda**: DynamoDB Client API Lambda（`dynamodb-client-example-dev-records`）
- **Admin UI**: React Adminベースの管理画面

## Requirements

### Requirement 1: dynamodb-client 1.1.2へのアップグレード

**User Story:** As a developer, I want to upgrade to dynamodb-client 1.1.2, so that I can use the latest Parameter Store structure and bug fixes.

#### Acceptance Criteria

1. THE System SHALL update package.json to use `@exabugs/dynamodb-client: ^1.1.2`
2. THE System SHALL run `pnpm install` to update dependencies
3. THE System SHALL verify the new version is installed correctly
4. THE System SHALL update Terraform module references if needed

### Requirement 2: Parameter Store命名規則の統一

**User Story:** As a developer, I want consistent parameter naming conventions, so that I can easily understand the purpose and usage of each parameter.

#### Acceptance Criteria

1. THE System SHALL use a hierarchical naming structure: `/{project}/{env}/{category}/{parameter-name}`
2. THE System SHALL use kebab-case for all parameter names
3. THE System SHALL use consistent category names across all parameters
4. THE System SHALL document the naming convention

### Requirement 3: カテゴリの標準化

**User Story:** As a developer, I want standardized category names, so that I can quickly locate related parameters.

#### Acceptance Criteria

1. THE System SHALL use the following standard categories:
   - `admin-ui`: Admin UI specific configuration (API URL, Cognito設定)
   - `infra`: Infrastructure information (DynamoDB table names, ARNs)
2. THE System SHALL migrate existing parameters to standard categories
3. THE System SHALL use client-specific categories for client configuration

### Requirement 4: Admin UI Parameter Store構造

**User Story:** As a developer, I want clear separation of Admin UI parameters, so that the Admin UI can access its required configuration.

#### Acceptance Criteria

1. THE System SHALL organize Admin UI parameters under `/{project}/{env}/admin-ui/`:
   - `api-url`: Records Lambda API URL（データアクセスAPI）
   - `cognito-user-pool-id`: Admin UI専用User Pool ID
   - `cognito-client-id`: Admin UI専用Client ID
   - `cognito-domain`: Admin UI専用Cognito Domain
2. THE System SHALL NOT duplicate parameter values across categories
3. THE System SHALL document which parameters Admin UI reads

### Requirement 5: Infrastructure Parameter Store構造

**User Story:** As a developer, I want infrastructure parameters organized separately, so that internal systems can access shared resources.

#### Acceptance Criteria

1. THE System SHALL organize infrastructure parameters under `/{project}/{env}/infra/`:
   - `dynamodb-table-name`: DynamoDBテーブル名
   - `dynamodb-table-arn`: DynamoDBテーブルARN
   - `records-lambda-arn`: Records Lambda ARN
2. THE System SHALL document which systems read infrastructure parameters

### Requirement 6: Terraform設定の更新

**User Story:** As a developer, I want Terraform configuration updated to use new Parameter Store structure, so that deployments work correctly.

#### Acceptance Criteria

1. WHEN dynamodb-client module is called, THEN it SHALL use the new parameter structure
2. THE System SHALL remove deprecated parameter references
3. THE System SHALL update data sources to read from new parameter paths
4. THE System SHALL verify Terraform plan shows expected changes

### Requirement 7: Makefile環境設定コマンドの更新

**User Story:** As a developer, I want Makefile commands updated to use new Parameter Store paths, so that environment configuration works correctly.

#### Acceptance Criteria

1. THE System SHALL update `make env-admin` to read from new parameter paths
2. THE System SHALL generate correct `.env.{mode}` files for Admin UI
3. THE System SHALL verify generated environment files contain correct values
4. THE System SHALL document the updated Makefile commands

### Requirement 8: 後方互換性の維持

**User Story:** As a developer, I want backward compatibility during migration, so that existing deployments continue to work.

#### Acceptance Criteria

1. WHEN parameters are renamed or moved, THEN the System SHALL create new parameters without deleting old ones immediately
2. THE System SHALL provide a migration timeline
3. THE System SHALL document which parameters are deprecated
4. THE System SHALL provide rollback instructions if needed

### Requirement 9: ドキュメントの整備

**User Story:** As a developer, I want comprehensive documentation of Parameter Store structure, so that I can understand the system without reading Terraform code.

#### Acceptance Criteria

1. THE System SHALL provide a Parameter Store structure diagram
2. THE System SHALL document each parameter's purpose and usage
3. THE System SHALL document which clients read which parameters
4. THE System SHALL provide migration guide for existing deployments

## Parameter Store Structure (After Migration)

### Admin UI Parameters
```
/dynamodb-client-example/{env}/admin-ui/
  ├── api-url                  # Records Lambda API URL
  ├── cognito-user-pool-id     # Cognito User Pool ID
  ├── cognito-client-id        # Cognito Client ID
  └── cognito-domain           # Cognito Domain
```

### Infrastructure Parameters
```
/dynamodb-client-example/{env}/infra/
  ├── dynamodb-table-name      # DynamoDB Table Name
  ├── dynamodb-table-arn       # DynamoDB Table ARN
  └── records-lambda-arn       # Records Lambda ARN
```

## Migration Steps

1. **Phase 1: Package Update**
   - Update package.json to `@exabugs/dynamodb-client: ^1.1.2`
   - Run `pnpm install`
   - Verify installation

2. **Phase 2: Terraform Update**
   - Update Terraform module call to use new parameter structure
   - Remove deprecated parameter references
   - Update data sources

3. **Phase 3: Makefile Update**
   - Update `make env-admin` command
   - Test environment file generation

4. **Phase 4: Deployment**
   - Run `terraform plan` to verify changes
   - Run `terraform apply` to create new parameters
   - Verify Admin UI can read new parameters

5. **Phase 5: Cleanup**
   - Document deprecated parameters
   - Plan removal of old parameters (after grace period)

## Success Criteria

- [ ] `@exabugs/dynamodb-client` is upgraded to 1.1.2
- [ ] New Parameter Store structure is created
- [ ] Admin UI can read configuration from new parameters
- [ ] Makefile commands work with new parameter paths
- [ ] Documentation is updated
- [ ] Terraform plan shows expected changes
- [ ] Deployment succeeds without errors
