# Deployment Setup Checklist

Use this checklist to ensure your GitHub Actions deployment is properly configured.

## Prerequisites

- [ ] GitHub repository created and code pushed
- [ ] AWS account with appropriate permissions
- [ ] AWS CLI installed and configured locally
- [ ] Node.js 18+ installed for local testing

## AWS Infrastructure Setup

### 1. OIDC Provider
- [ ] Create OIDC provider in AWS IAM
  ```bash
  aws cloudformation create-stack \
    --stack-name github-oidc-provider \
    --template-body file://aws-infrastructure/github-oidc-setup.yaml \
    --capabilities CAPABILITY_IAM
  ```
- [ ] Verify OIDC provider created successfully
- [ ] Note the provider ARN for IAM role setup

### 2. IAM Roles (Create 3 roles - one per environment)

#### Development Role
- [ ] Create IAM role: `GitHubActions-Dev`
- [ ] Configure trust policy with OIDC provider
- [ ] Set condition: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/develop`
- [ ] Attach S3 permissions policy
- [ ] Attach CloudFront permissions (if using)
- [ ] Copy role ARN: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Dev`

#### Staging Role
- [ ] Create IAM role: `GitHubActions-Stage`
- [ ] Configure trust policy with OIDC provider
- [ ] Set condition: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/staging`
- [ ] Attach S3 permissions policy
- [ ] Attach CloudFront permissions (if using)
- [ ] Copy role ARN: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Stage`

#### Production Role
- [ ] Create IAM role: `GitHubActions-Prod`
- [ ] Configure trust policy with OIDC provider
- [ ] Set condition: `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main`
- [ ] Attach S3 permissions policy
- [ ] Attach CloudFront permissions (if using)
- [ ] Copy role ARN: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Prod`

### 3. S3 Buckets (Create 3 buckets - one per environment)

#### Development Bucket
- [ ] Create bucket: `YOUR_BUCKET_NAME-development`
- [ ] Enable static website hosting
- [ ] Set index document: `index.html`
- [ ] Set error document: `index.html`
- [ ] Configure bucket policy (if not using CloudFront)
- [ ] Configure CORS policy
- [ ] Enable versioning (recommended)

#### Staging Bucket
- [ ] Create bucket: `YOUR_BUCKET_NAME-staging`
- [ ] Enable static website hosting
- [ ] Set index document: `index.html`
- [ ] Set error document: `index.html`
- [ ] Configure bucket policy (if not using CloudFront)
- [ ] Configure CORS policy
- [ ] Enable versioning (recommended)

#### Production Bucket
- [ ] Create bucket: `YOUR_BUCKET_NAME-production`
- [ ] Enable static website hosting
- [ ] Set index document: `index.html`
- [ ] Set error document: `index.html`
- [ ] Configure bucket policy (if not using CloudFront)
- [ ] Configure CORS policy
- [ ] Enable versioning (recommended)

### 4. CloudFront Distributions (Optional but recommended)

#### Development Distribution
- [ ] Create CloudFront distribution
- [ ] Point to S3 bucket: `YOUR_BUCKET_NAME-development`
- [ ] Configure custom error responses (403, 404 → /index.html)
- [ ] Enable compression
- [ ] Copy distribution ID: `E1234567890ABC`

#### Staging Distribution
- [ ] Create CloudFront distribution
- [ ] Point to S3 bucket: `YOUR_BUCKET_NAME-staging`
- [ ] Configure custom error responses (403, 404 → /index.html)
- [ ] Enable compression
- [ ] Copy distribution ID: `E1234567890ABC`

#### Production Distribution
- [ ] Create CloudFront distribution
- [ ] Point to S3 bucket: `YOUR_BUCKET_NAME-production`
- [ ] Configure custom error responses (403, 404 → /index.html)
- [ ] Enable compression
- [ ] Configure custom domain (optional)
- [ ] Configure SSL certificate (optional)
- [ ] Copy distribution ID: `E1234567890ABC`

## GitHub Configuration

### 1. Repository Secrets
Navigate to: Settings → Secrets and variables → Actions → Secrets

- [ ] Add `AWS_ROLE_ARN_DEV`
  - Value: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Dev`
- [ ] Add `AWS_ROLE_ARN_STAGE`
  - Value: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Stage`
- [ ] Add `AWS_ROLE_ARN_PROD`
  - Value: `arn:aws:iam::ACCOUNT_ID:role/GitHubActions-Prod`

### 2. Repository Variables
Navigate to: Settings → Secrets and variables → Actions → Variables

#### Backend URLs
- [ ] Add `BACKEND_URL_DEV`
  - Value: `https://api-dev.example.com` (no trailing slash)
- [ ] Add `BACKEND_URL_STAGE`
  - Value: `https://api-stage.example.com` (no trailing slash)
- [ ] Add `BACKEND_URL_PROD`
  - Value: `https://api.example.com` (no trailing slash)

#### S3 Configuration
- [ ] Add `S3_BUCKET_NAME`
  - Value: `YOUR_BUCKET_NAME` (without environment suffix)

#### CloudFront Configuration (Optional)
- [ ] Add `CLOUDFRONT_DISTRIBUTION_ID`
  - Value: `E1234567890ABC` (without environment suffix)
  - Or leave empty if not using CloudFront

#### Frontend URLs
- [ ] Add `FRONTEND_URL_DEV`
  - Value: `https://dev.example.com` (no trailing slash)
- [ ] Add `FRONTEND_URL_STAGE`
  - Value: `https://stage.example.com` (no trailing slash)
- [ ] Add `FRONTEND_URL_PROD`
  - Value: `https://example.com` (no trailing slash)

### 3. Environment Protection Rules (Recommended)

#### Production Environment
- [ ] Navigate to: Settings → Environments → New environment
- [ ] Name: `production`
- [ ] Enable "Required reviewers"
- [ ] Add reviewers (team members who can approve deployments)
- [ ] Enable "Wait timer" (optional delay before deployment)
- [ ] Save protection rules

#### Staging Environment (Optional)
- [ ] Navigate to: Settings → Environments → New environment
- [ ] Name: `staging`
- [ ] Configure protection rules as needed

## Testing

### 1. Local Testing
- [ ] Install dependencies: `npm ci`
- [ ] Run unit tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Build locally: `npm run build`
- [ ] Test preview: `npm run preview`

### 2. Integration Test (Local)
- [ ] Start preview server: `npm run preview`
- [ ] Run integration tests:
  ```bash
  BACKEND_URL=https://api-dev.example.com \
  FRONTEND_URL=http://localhost:4173 \
  node tests/integration/backend-integration.test.js
  ```
- [ ] Verify all tests pass

### 3. First Deployment Test

#### Development Environment
- [ ] Create test branch from `develop`
- [ ] Make a small change (e.g., update README)
- [ ] Push to `develop` branch
- [ ] Monitor workflow in Actions tab
- [ ] Verify workflow completes successfully
- [ ] Check deployment at frontend URL
- [ ] Verify backend connectivity
- [ ] Review test artifacts

#### Staging Environment
- [ ] Merge to `staging` branch
- [ ] Monitor workflow in Actions tab
- [ ] Verify deployment
- [ ] Run smoke tests manually if needed

#### Production Environment
- [ ] Merge to `main` branch
- [ ] Approve deployment (if protection rules enabled)
- [ ] Monitor workflow in Actions tab
- [ ] Verify deployment
- [ ] Run smoke tests
- [ ] Verify all functionality

## Post-Deployment Verification

### Automated Checks (via workflow)
- [ ] Build job completed successfully
- [ ] Integration tests passed
- [ ] Deployment job completed
- [ ] Smoke tests passed
- [ ] No errors in workflow logs

### Manual Checks
- [ ] Frontend loads at correct URL
- [ ] Login page accessible
- [ ] Can authenticate with backend
- [ ] Dashboard loads with data
- [ ] Navigation works correctly
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] SSL certificate valid (if HTTPS)

## Monitoring Setup

### GitHub Actions
- [ ] Enable email notifications for workflow failures
- [ ] Set up Slack/Discord webhook (optional)
- [ ] Configure status badges in README (optional)

### AWS
- [ ] Enable S3 access logging
- [ ] Enable CloudFront logging (if using)
- [ ] Set up CloudWatch alarms for errors
- [ ] Configure billing alerts

## Documentation

- [ ] Update README with deployment instructions
- [ ] Document environment-specific configurations
- [ ] Create runbook for common issues
- [ ] Document rollback procedure
- [ ] Share access with team members

## Security Review

- [ ] Verify no secrets in code
- [ ] Confirm OIDC is working (no long-lived credentials)
- [ ] Review IAM role permissions (principle of least privilege)
- [ ] Enable MFA for AWS account
- [ ] Review S3 bucket policies
- [ ] Verify CloudFront security headers
- [ ] Enable AWS CloudTrail for audit logging
- [ ] Set up secret rotation schedule

## Maintenance

- [ ] Schedule regular dependency updates
- [ ] Plan for secret rotation
- [ ] Document backup/restore procedures
- [ ] Set up monitoring dashboards
- [ ] Create incident response plan

## Troubleshooting Resources

If you encounter issues, refer to:
- [ ] `docs/github-secrets-setup.md` - Quick setup guide
- [ ] `docs/github-actions-setup.md` - Complete documentation with troubleshooting
- [ ] `.github/DEPLOYMENT.md` - Deployment overview
- [ ] GitHub Actions logs - Detailed error messages
- [ ] AWS CloudWatch logs - Backend and infrastructure logs

## Success Criteria

Your deployment is successful when:
- [ ] All three environments deploy automatically on branch push
- [ ] Integration tests pass before deployment
- [ ] Smoke tests pass after deployment
- [ ] Frontend connects to correct backend for each environment
- [ ] No manual intervention required for deployments
- [ ] Team members can trigger manual deployments
- [ ] Rollback procedure is documented and tested

---

## Quick Reference

**Workflow File**: `.github/workflows/deploy.yml`

**Test Files**:
- Integration: `tests/integration/backend-integration.test.js`
- Smoke: `tests/smoke/post-deployment.test.js`

**Documentation**:
- Quick Setup: `docs/github-secrets-setup.md`
- Complete Guide: `docs/github-actions-setup.md`
- Overview: `.github/DEPLOYMENT.md`

**Support**: See troubleshooting section in `docs/github-actions-setup.md`
