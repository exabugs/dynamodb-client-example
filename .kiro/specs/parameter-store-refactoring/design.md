# Design Document: Parameter Store設定の整理とdynamodb-client 1.1.2へのアップグレード

## Overview

dynamodb-client-exampleプロジェクトで、`@exabugs/dynamodb-client`を1.0.0から1.1.2にアップグレードし、Parameter Store設定を新しい命名規則に移行します。

## Architecture

### Current State (v1.0.0)

```
/dynamodb-client-example/{env}/app/
  ├── records-api-url              # Records Lambda URL
  └── admin-ui/
      ├── cognito-user-pool-id
      ├── cognito-client-id
      └── cognito-domain

/dynamodb-client-example/{env}/infra/
  └── dynamodb-table-name
```

### Target State (v1.1.2)

```
/dynamodb-client-example/{env}/admin-ui/
  ├── api-url                      # Records Lambda URL (renamed)
  ├── cognito-user-pool-id
  ├── cognito-client-id
  └── cognito-domain

/dynamodb-client-example/{env}/infra/
  ├── dynamodb-table-name
  ├── dynamodb-table-arn           # New
  └── records-lambda-arn           # New
```

## Components and Interfaces

### 1. Package Update

**File**: `package.json`

```json
{
  "dependencies": {
    "@exabugs/dynamodb-client": "^1.1.2"
  }
}
```

**Changes**:
- Update version from `^1.0.0` to `^1.1.2`

### 2. Terraform Module Call

**File**: `infra/main.tf`

**Current**:
```hcl
module "lambda_records" {
  source = "../node_modules/@exabugs/dynamodb-client/terraform"

  # ... existing configuration ...
  cognito_client_id          = module.cognito.admin_ui_client_id
  cognito_user_pool_domain   = module.cognito.user_pool_domain
  cognito_admin_ui_client_id = module.cognito.admin_ui_client_id
}
```

**Target**:
```hcl
module "lambda_records" {
  source = "../node_modules/@exabugs/dynamodb-client/terraform"

  project_name = var.project_name
  environment  = var.environment
  region       = var.region

  # DynamoDB設定
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Cognito設定（v1.1.2では不要 - Parameter Storeから自動取得）
  # cognito_user_pool_id は内部で Parameter Store から取得される

  # ログ設定
  log_retention_days = var.log_retention_days
  log_level          = var.lambda_records_log_level
}
```

**Changes**:
- Remove `cognito_client_id` (deprecated in v1.1.2)
- Remove `cognito_user_pool_domain` (deprecated in v1.1.2)
- Remove `cognito_admin_ui_client_id` (deprecated in v1.1.2)
- Module now reads Cognito configuration from Parameter Store internally

### 3. Parameter Store Data Sources

**File**: `infra/main.tf`

**Current**:
```hcl
data "aws_ssm_parameter" "records_api_url" {
  name = "/${var.project_name}/${var.environment}/app/records-api-url"
}

data "aws_ssm_parameter" "cognito_user_pool_id" {
  name = "/${var.project_name}/${var.environment}/app/admin-ui/cognito-user-pool-id"
}
```

**Target**:
```hcl
# Admin UI Parameters
data "aws_ssm_parameter" "admin_ui_api_url" {
  name       = "/${var.project_name}/${var.environment}/admin-ui/api-url"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "admin_ui_cognito_user_pool_id" {
  name       = "/${var.project_name}/${var.environment}/admin-ui/cognito-user-pool-id"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "admin_ui_cognito_client_id" {
  name       = "/${var.project_name}/${var.environment}/admin-ui/cognito-client-id"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "admin_ui_cognito_domain" {
  name       = "/${var.project_name}/${var.environment}/admin-ui/cognito-domain"
  depends_on = [module.lambda_records]
}

# Infrastructure Parameters
data "aws_ssm_parameter" "infra_dynamodb_table_name" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-table-name"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "infra_dynamodb_table_arn" {
  name       = "/${var.project_name}/${var.environment}/infra/dynamodb-table-arn"
  depends_on = [module.lambda_records]
}

data "aws_ssm_parameter" "infra_records_lambda_arn" {
  name       = "/${var.project_name}/${var.environment}/infra/records-lambda-arn"
  depends_on = [module.lambda_records]
}
```

**Changes**:
- Rename `/app/records-api-url` → `/admin-ui/api-url`
- Move `/app/admin-ui/*` → `/admin-ui/*`
- Add new infrastructure parameters
- Update data source names for clarity

### 4. Makefile Environment Configuration

**File**: `Makefile`

**Current**:
```makefile
env-admin:
	@echo "VITE_RECORDS_API_URL=$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/app/records-api-url' ...)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_USER_POOL_ID=$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/app/admin-ui/cognito-user-pool-id' ...)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
```

**Target**:
```makefile
env-admin:
	@echo "# Auto-generated from Parameter Store (ENV=$(ENV))" > apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "# Records Lambda API URL" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_RECORDS_API_URL=$$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/admin-ui/api-url' --with-decryption --query 'Parameter.Value' --output text --region $(REGION))" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "# Cognito User Pool設定" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_USER_POOL_ID=$$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/admin-ui/cognito-user-pool-id' --with-decryption --query 'Parameter.Value' --output text --region $(REGION))" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_USER_POOL_CLIENT_ID=$$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/admin-ui/cognito-client-id' --with-decryption --query 'Parameter.Value' --output text --region $(REGION))" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_DOMAIN=$$(aws ssm get-parameter --name '/$(PROJECT_NAME)/$(ENV)/admin-ui/cognito-domain' --with-decryption --query 'Parameter.Value' --output text --region $(REGION))" >> apps/admin/.env.$(VITE_MODE_$(ENV))
	@echo "VITE_COGNITO_REGION=$(REGION)" >> apps/admin/.env.$(VITE_MODE_$(ENV))
```

**Changes**:
- Update parameter paths to new structure
- Add proper shell escaping with `$$(...)`
- Add comments for clarity

## Data Models

### Parameter Store Structure

```typescript
interface ParameterStoreStructure {
  adminUi: {
    apiUrl: string;              // Records Lambda URL
    cognitoUserPoolId: string;
    cognitoClientId: string;
    cognitoDomain: string;
  };
  infra: {
    dynamodbTableName: string;
    dynamodbTableArn: string;
    recordsLambdaArn: string;
  };
}
```

## Error Handling

### Migration Errors

1. **Missing Parameters**: If old parameters don't exist, module will create new ones
2. **Permission Errors**: Ensure AWS credentials have SSM read/write permissions
3. **Terraform State**: Use `terraform plan` to verify changes before applying

### Rollback Strategy

If migration fails:
1. Revert package.json to `^1.0.0`
2. Run `pnpm install`
3. Revert Terraform changes
4. Run `terraform apply` to restore old state

## Testing Strategy

### Unit Tests

Not applicable (infrastructure changes only)

### Integration Tests

1. **Terraform Plan Verification**
   ```bash
   cd infra
   make plan ENV=dev
   # Verify: New parameters will be created
   # Verify: No resources will be destroyed
   ```

2. **Parameter Store Verification**
   ```bash
   # After deployment
   aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/api-url'
   aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/cognito-user-pool-id'
   ```

3. **Admin UI Configuration Verification**
   ```bash
   make env-admin ENV=dev
   cat apps/admin/.env.development
   # Verify: All required environment variables are present
   ```

4. **Admin UI Runtime Verification**
   ```bash
   make dev-admin
   # Verify: Admin UI starts without errors
   # Verify: Admin UI can authenticate with Cognito
   # Verify: Admin UI can access Records Lambda API
   ```

## Implementation Steps

### Step 1: Package Update

```bash
cd dynamodb-client-example

# Update package.json
vim package.json
# Change: "@exabugs/dynamodb-client": "^1.0.0"
# To:     "@exabugs/dynamodb-client": "^1.1.2"

# Install new version
pnpm install

# Verify installation
pnpm list @exabugs/dynamodb-client
```

### Step 2: Terraform Update

```bash
# Update infra/main.tf
vim infra/main.tf

# Remove deprecated parameters from module call:
# - cognito_client_id
# - cognito_user_pool_domain
# - cognito_admin_ui_client_id

# Update data sources to use new parameter paths
```

### Step 3: Makefile Update

```bash
# Update Makefile
vim Makefile

# Update env-admin target to use new parameter paths
```

### Step 4: Deployment

```bash
# Plan changes
cd infra
make plan ENV=dev

# Review plan output
# Expected: New parameters will be created
# Expected: Module will be updated

# Apply changes
make apply ENV=dev

# Verify parameters
aws ssm get-parameter --name '/dynamodb-client-example/dev/admin-ui/api-url'
```

### Step 5: Verification

```bash
# Generate Admin UI environment file
make env-admin ENV=dev

# Verify environment file
cat apps/admin/.env.development

# Test Admin UI
make dev-admin
```

## Migration Timeline

1. **Day 1**: Package update and Terraform changes
2. **Day 2**: Deployment to dev environment
3. **Day 3**: Verification and testing
4. **Day 7**: Deployment to stg environment (if applicable)
5. **Day 14**: Deployment to prd environment (if applicable)
6. **Day 30**: Remove old parameters (after grace period)

## Documentation Updates

### Files to Update

1. **README.md**: Update Parameter Store structure documentation
2. **QUICKSTART.md**: Update deployment instructions
3. **infra/README.md**: Update Terraform module documentation

### Parameter Store Documentation

Create `docs/parameter-store.md`:

```markdown
# Parameter Store Structure

## Admin UI Parameters

- `/dynamodb-client-example/{env}/admin-ui/api-url`
  - Purpose: Records Lambda API URL
  - Used by: Admin UI
  - Created by: dynamodb-client Terraform module

- `/dynamodb-client-example/{env}/admin-ui/cognito-user-pool-id`
  - Purpose: Cognito User Pool ID
  - Used by: Admin UI
  - Created by: dynamodb-client Terraform module

## Infrastructure Parameters

- `/dynamodb-client-example/{env}/infra/dynamodb-table-name`
  - Purpose: DynamoDB Table Name
  - Used by: Internal systems
  - Created by: dynamodb-client Terraform module
```

## Success Criteria

- [ ] Package.json updated to `@exabugs/dynamodb-client: ^1.1.2`
- [ ] `pnpm install` completes successfully
- [ ] Terraform module call updated (deprecated parameters removed)
- [ ] Data sources updated to new parameter paths
- [ ] Makefile `env-admin` command updated
- [ ] `terraform plan` shows expected changes
- [ ] `terraform apply` succeeds
- [ ] New parameters created in Parameter Store
- [ ] Admin UI environment file generated correctly
- [ ] Admin UI starts without errors
- [ ] Admin UI can authenticate and access API
- [ ] Documentation updated

## References

- [asanowa Parameter Store Refactoring](../../asanowa/.kiro/specs/parameter-store-refactoring/requirements.md)
- [@exabugs/dynamodb-client v1.1.2 Release Notes](https://github.com/exabugs/dynamodb-client/releases/tag/v1.1.2)
- [Parameter Store Design Guidelines](../../.kiro/steering/parameter-store-design.md)
