# Deployment Overview

This document provides a quick overview of the deployment setup for this project.

## What's Included

### GitHub Actions Workflow
- **File**: `.github/workflows/deploy.yml`
- **Environments**: Development, Staging, Production
- **Triggers**: Push to branches, pull requests, manual dispatch
- **Features**:
  - Automated build and test
  - Environment-specific configuration
  - Integration testing with backend
  - AWS deployment via OIDC
  - Post-deployment smoke tests
  - Artifact uploads for debugging

### Integration Tests
- **File**: `tests/integration/backend-integration.test.js`
- **Purpose**: Verify frontend-backend integration before deployment
- **Tests**:
  - Backend health check
  - Frontend loads correctly
  - API configuration
  - CORS configuration
  - API endpoints accessibility
  - Login endpoint integration

### Smoke Tests
- **File**: `tests/smoke/post-deployment.test.js`
- **Purpose**: Verify deployment success and basic functionality
- **Tests**:
  - Deployment accessibility
  - Backend connectivity
  - SSL certificate validation
  - Page load performance
  - Console error detection
  - Critical assets loading
  - Login page functionality
- **Output**: JSON results + HTML report

### Documentation
- **Quick Setup**: `docs/github-secrets-setup.md` - Step-by-step configuration
- **Complete Guide**: `docs/github-actions-setup.md` - Full documentation
- **This File**: Quick reference and overview

## Quick Start

1. **Configure GitHub Secrets** (Settings → Secrets and variables → Actions → Secrets):
   - `AWS_ROLE_ARN_DEV`
   - `AWS_ROLE_ARN_STAGE`
   - `AWS_ROLE_ARN_PROD`

2. **Configure GitHub Variables** (Settings → Secrets and variables → Actions → Variables):
   - `BACKEND_URL_DEV`, `BACKEND_URL_STAGE`, `BACKEND_URL_PROD`
   - `S3_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID` (optional)
   - `FRONTEND_URL_DEV`, `FRONTEND_URL_STAGE`, `FRONTEND_URL_PROD`

3. **Set up AWS**:
   - Create OIDC provider (use `aws-infrastructure/github-oidc-setup.yaml`)
   - Create IAM roles for each environment
   - Create S3 buckets
   - (Optional) Create CloudFront distributions

4. **Deploy**:
   - Push to `develop`, `staging`, or `main` branch
   - Or manually trigger via Actions tab

## Environment Mapping

| Branch | Environment | AWS Role Secret | Backend URL Variable |
|--------|-------------|-----------------|---------------------|
| develop | development | AWS_ROLE_ARN_DEV | BACKEND_URL_DEV |
| staging | staging | AWS_ROLE_ARN_STAGE | BACKEND_URL_STAGE |
| main | production | AWS_ROLE_ARN_PROD | BACKEND_URL_PROD |

## Workflow Jobs

1. **determine-environment**: Identifies target environment and sets variables
2. **build**: Installs deps, runs tests, builds app
3. **integration-test**: Tests backend integration
4. **deploy**: Uploads to S3, invalidates CloudFront
5. **smoke-test**: Verifies deployment success

## Testing Locally

### Integration Tests
```bash
npm ci
npm run preview &
BACKEND_URL=https://api-dev.example.com \
FRONTEND_URL=http://localhost:4173 \
node tests/integration/backend-integration.test.js
```

### Smoke Tests
```bash
BACKEND_URL=https://api.example.com \
FRONTEND_URL=https://example.com \
node tests/smoke/post-deployment.test.js
```

## Monitoring

- **GitHub Actions**: View workflow runs in Actions tab
- **Test Artifacts**: Download from workflow run page
- **Deployment Summary**: View in workflow run summary
- **Smoke Test Report**: HTML report in artifacts

## Troubleshooting

See `docs/github-actions-setup.md` for detailed troubleshooting guide.

Common issues:
- **Authentication errors**: Check OIDC provider and IAM role trust policy
- **Build failures**: Review linter/test errors in job logs
- **Integration test failures**: Verify backend URL and CORS configuration
- **Deployment failures**: Check S3 bucket permissions and IAM role
- **Smoke test failures**: Review smoke test logs and HTML report

## Security

- Uses AWS OIDC (no long-lived credentials)
- Secrets never exposed in logs
- Minimal IAM permissions
- Environment protection rules recommended for production

## Next Steps

1. Read `docs/github-secrets-setup.md` for step-by-step setup
2. Configure all required secrets and variables
3. Set up AWS infrastructure
4. Test deployment to development environment
5. Set up environment protection rules for production
6. Configure notifications for deployment failures

## Support

For detailed documentation, see:
- `docs/github-secrets-setup.md` - Quick setup guide
- `docs/github-actions-setup.md` - Complete documentation
- `.github/workflows/deploy.yml` - Workflow configuration
