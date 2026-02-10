# GitHub Actions Deployment Setup

This document explains how to set up and configure the GitHub Actions workflow for deploying the frontend to AWS.

## Overview

The deployment workflow supports three environments:
- **Development** (develop branch)
- **Staging** (staging branch)
- **Production** (main branch)

## Prerequisites

1. AWS account with appropriate permissions
2. S3 buckets for each environment
3. (Optional) CloudFront distributions for each environment
4. GitHub repository with appropriate access

## Required GitHub Secrets

Configure the following secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### AWS Role ARNs (Secrets)

These should be configured as **Repository Secrets**:

- `AWS_ROLE_ARN_DEV` - IAM role ARN for development environment
- `AWS_ROLE_ARN_STAGE` - IAM role ARN for staging environment
- `AWS_ROLE_ARN_PROD` - IAM role ARN for production environment

Example format:
```
arn:aws:iam::123456789012:role/GitHubActionsRole-Dev
```

## Required GitHub Variables

Configure the following variables in your GitHub repository settings (Settings → Secrets and variables → Actions → Variables):

### Backend URLs (Variables)

- `BACKEND_URL_DEV` - Backend API URL for development (e.g., `https://api-dev.example.com`)
- `BACKEND_URL_STAGE` - Backend API URL for staging (e.g., `https://api-stage.example.com`)
- `BACKEND_URL_PROD` - Backend API URL for production (e.g., `https://api.example.com`)

### S3 Bucket Names (Variables)

- `S3_BUCKET_NAME` - Base name for S3 buckets (will be suffixed with environment)
  - Example: `my-app-frontend` will create:
    - `my-app-frontend-development`
    - `my-app-frontend-staging`
    - `my-app-frontend-production`

### CloudFront Distribution IDs (Variables - Optional)

- `CLOUDFRONT_DISTRIBUTION_ID` - Base CloudFront distribution ID (will be suffixed with environment)
  - Example: `E1234567890ABC`
  - Leave empty if not using CloudFront

### Frontend URLs (Variables)

- `FRONTEND_URL_DEV` - Frontend URL for development (e.g., `https://dev.example.com`)
- `FRONTEND_URL_STAGE` - Frontend URL for staging (e.g., `https://stage.example.com`)
- `FRONTEND_URL_PROD` - Frontend URL for production (e.g., `https://example.com`)

## AWS IAM Setup

### 1. Create OIDC Provider

Use the CloudFormation template in `aws-infrastructure/github-oidc-setup.yaml` or create manually:

```bash
aws cloudformation create-stack \
  --stack-name github-oidc-provider \
  --template-body file://aws-infrastructure/github-oidc-setup.yaml \
  --capabilities CAPABILITY_IAM
```

### 2. Create IAM Roles

Create three IAM roles (one per environment) with the following trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/develop"
        }
      }
    }
  ]
}
```

Adjust the `sub` condition for each environment:
- Development: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/develop`
- Staging: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/staging`
- Production: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main`

### 3. Attach Permissions Policy

Attach this policy to each role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME-ENVIRONMENT/*",
        "arn:aws:s3:::YOUR_BUCKET_NAME-ENVIRONMENT"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

## S3 Bucket Configuration

Create S3 buckets for each environment with the following settings:

1. **Static Website Hosting**: Enabled
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

2. **Bucket Policy** (if not using CloudFront):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

3. **CORS Configuration**:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## CloudFront Configuration (Optional)

If using CloudFront:

1. Create distributions pointing to S3 buckets
2. Configure custom error responses:
   - Error Code: 403, 404
   - Response Page Path: `/index.html`
   - Response Code: 200
3. Enable compression
4. Set appropriate cache behaviors

## Workflow Triggers

The workflow runs on:

1. **Push to branches**:
   - `develop` → deploys to development
   - `staging` → deploys to staging
   - `main` → deploys to production

2. **Pull requests** (build and test only, no deployment)

3. **Manual trigger** (workflow_dispatch):
   - Allows selecting any environment manually

## Workflow Jobs

### 1. Determine Environment
- Identifies target environment based on branch or manual input
- Sets environment-specific variables

### 2. Build
- Installs dependencies
- Runs linter
- Runs unit tests with coverage
- Builds application with environment-specific backend URL
- Uploads build artifacts

### 3. Integration Test
- Downloads build artifacts
- Starts preview server
- Runs integration tests against backend
- Verifies API connectivity and CORS configuration

### 4. Deploy
- Downloads build artifacts
- Configures AWS credentials using OIDC
- Syncs files to S3 with optimized cache headers
- Invalidates CloudFront cache (if configured)
- Only runs on push events (not PRs)

### 5. Smoke Test
- Runs post-deployment verification tests
- Checks deployment accessibility
- Verifies backend connectivity
- Tests page load performance
- Checks for console errors
- Generates HTML test report

## Testing

### Integration Tests

Located in `tests/integration/backend-integration.test.js`

Tests include:
- Backend health check
- Frontend loads correctly
- API configuration
- CORS configuration
- API endpoints accessibility
- Login endpoint integration

Run locally:
```bash
BACKEND_URL=https://api-dev.example.com \
FRONTEND_URL=http://localhost:4173 \
node tests/integration/backend-integration.test.js
```

### Smoke Tests

Located in `tests/smoke/post-deployment.test.js`

Tests include:
- Deployment accessibility
- Backend connectivity
- SSL certificate validation
- Page load performance
- Console error detection
- Critical assets loading
- Login page functionality

Run locally:
```bash
BACKEND_URL=https://api.example.com \
FRONTEND_URL=https://example.com \
node tests/smoke/post-deployment.test.js
```

## Manual Deployment

To manually trigger a deployment:

1. Go to Actions tab in GitHub
2. Select "Deploy Frontend to AWS" workflow
3. Click "Run workflow"
4. Select target environment
5. Click "Run workflow"

## Monitoring

### GitHub Actions UI

- View workflow runs in the Actions tab
- Check job logs for detailed information
- Download test artifacts for analysis

### Test Results

Test results are uploaded as artifacts:
- `test-results` - Unit test coverage and results
- `integration-test-results-{env}` - Integration test results
- `smoke-test-results-{env}` - Smoke test results with HTML report

### Deployment Summary

Each deployment creates a summary with:
- Environment deployed to
- Backend URL used
- Commit SHA
- Branch name

## Troubleshooting

### Authentication Errors

If you see "Error: Could not assume role":
1. Verify OIDC provider is configured correctly
2. Check IAM role trust policy matches your repository
3. Ensure role ARN secrets are correct

### Build Failures

If build fails:
1. Check linter errors in job logs
2. Review unit test failures
3. Verify all dependencies are in package.json

### Integration Test Failures

If integration tests fail:
1. Verify backend URL is correct and accessible
2. Check CORS configuration on backend
3. Ensure API endpoints exist and are responding

### Deployment Failures

If deployment fails:
1. Verify S3 bucket exists and is accessible
2. Check IAM role has correct permissions
3. Ensure bucket name variables are correct

### Smoke Test Failures

If smoke tests fail after deployment:
1. Check if files were uploaded to S3
2. Verify CloudFront invalidation completed
3. Check frontend URL is correct
4. Review smoke test logs for specific failures

## Best Practices

1. **Always test in development first** before promoting to staging/production
2. **Review PR builds** to catch issues before merging
3. **Monitor smoke tests** after each deployment
4. **Keep secrets secure** - never commit them to the repository
5. **Use environment protection rules** in GitHub for production deployments
6. **Tag releases** for production deployments for easy rollback

## Rollback Procedure

If a deployment needs to be rolled back:

1. **Quick rollback** (if previous version is tagged):
   ```bash
   git checkout <previous-tag>
   git push origin main --force
   ```

2. **Manual rollback**:
   - Manually trigger workflow with previous commit
   - Or restore previous S3 bucket version (if versioning enabled)

3. **CloudFront rollback**:
   - Invalidate cache after rollback
   - Or wait for TTL to expire

## Security Considerations

1. **Use OIDC** instead of long-lived AWS credentials
2. **Limit IAM permissions** to minimum required
3. **Enable S3 versioning** for easy rollback
4. **Use CloudFront** for DDoS protection and caching
5. **Enable CloudFront logging** for audit trail
6. **Rotate secrets regularly**
7. **Use environment protection rules** for production

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS OIDC with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
