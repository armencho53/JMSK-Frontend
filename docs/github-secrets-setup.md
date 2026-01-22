# GitHub Secrets and Variables Setup - Quick Reference

## Step-by-Step Setup Guide

### 1. Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, expand **Secrets and variables**
4. Click **Actions**

### 2. Add Repository Secrets

Click on **Secrets** tab, then **New repository secret** for each:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ROLE_ARN_DEV` | IAM Role ARN for development | `arn:aws:iam::123456789012:role/GitHubActions-Dev` |
| `AWS_ROLE_ARN_STAGE` | IAM Role ARN for staging | `arn:aws:iam::123456789012:role/GitHubActions-Stage` |
| `AWS_ROLE_ARN_PROD` | IAM Role ARN for production | `arn:aws:iam::123456789012:role/GitHubActions-Prod` |

### 3. Add Repository Variables

Click on **Variables** tab, then **New repository variable** for each:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `BACKEND_URL_DEV` | Development backend API URL | `https://api-dev.example.com` |
| `BACKEND_URL_STAGE` | Staging backend API URL | `https://api-stage.example.com` |
| `BACKEND_URL_PROD` | Production backend API URL | `https://api.example.com` |
| `S3_BUCKET_NAME` | Base S3 bucket name (env suffix added automatically) | `jewelry-frontend` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Base CloudFront ID (optional, env suffix added) | `E1234567890ABC` or leave empty |
| `FRONTEND_URL_DEV` | Development frontend URL | `https://dev.example.com` |
| `FRONTEND_URL_STAGE` | Staging frontend URL | `https://stage.example.com` |
| `FRONTEND_URL_PROD` | Production frontend URL | `https://example.com` |

## Verification Checklist

After adding all secrets and variables, verify:

- [ ] All 3 AWS Role ARN secrets are added
- [ ] All 3 Backend URL variables are added
- [ ] S3 bucket name variable is added
- [ ] All 3 Frontend URL variables are added
- [ ] CloudFront distribution ID is added (or intentionally left empty)
- [ ] No typos in variable/secret names (they are case-sensitive)
- [ ] URLs include protocol (https://) and no trailing slashes

## Testing the Setup

1. Create a test branch from `develop`
2. Make a small change and push
3. Check the Actions tab for workflow execution
4. Verify the workflow can access all secrets and variables

## Common Mistakes to Avoid

❌ **Don't:**
- Add trailing slashes to URLs (`https://api.example.com/` ❌)
- Forget the protocol (`api.example.com` ❌)
- Mix up secrets and variables (AWS roles must be secrets)
- Use spaces in variable names
- Commit secrets to the repository

✅ **Do:**
- Use clean URLs (`https://api.example.com` ✅)
- Double-check spelling and case
- Keep secrets secure and rotate regularly
- Document your configuration
- Test in development first

## Quick Copy-Paste Template

Use this template to prepare your values before adding them:

```bash
# Secrets (add in Secrets tab)
AWS_ROLE_ARN_DEV=arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME
AWS_ROLE_ARN_STAGE=arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME
AWS_ROLE_ARN_PROD=arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME

# Variables (add in Variables tab)
BACKEND_URL_DEV=https://api-dev.example.com
BACKEND_URL_STAGE=https://api-stage.example.com
BACKEND_URL_PROD=https://api.example.com

S3_BUCKET_NAME=jewelry-frontend

CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC

FRONTEND_URL_DEV=https://dev.example.com
FRONTEND_URL_STAGE=https://stage.example.com
FRONTEND_URL_PROD=https://example.com
```

## Need Help?

- See full documentation: `docs/github-actions-setup.md`
- AWS IAM setup: `aws-infrastructure/github-oidc-setup.yaml`
- Workflow file: `.github/workflows/deploy.yml`
