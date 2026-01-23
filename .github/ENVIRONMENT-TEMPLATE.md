# Environment Configuration Template

Use this template to prepare your environment-specific values before adding them to GitHub.

## Copy and Fill Out This Template

```bash
# ============================================
# DEVELOPMENT ENVIRONMENT
# ============================================

# AWS IAM Role ARN (GitHub Secret)
AWS_ROLE_ARN_DEV=arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-Dev

# Backend API URL (GitHub Variable)
BACKEND_URL_DEV=https://api-dev.example.com

# Frontend URL (GitHub Variable)
FRONTEND_URL_DEV=https://dev.example.com

# S3 Bucket Name (will be suffixed with -development)
# Example: jewelry-frontend becomes jewelry-frontend-development
S3_BUCKET_DEV=jewelry-frontend-development

# CloudFront Distribution ID (optional)
CLOUDFRONT_DIST_DEV=E1234567890ABC


# ============================================
# STAGING ENVIRONMENT
# ============================================

# AWS IAM Role ARN (GitHub Secret)
AWS_ROLE_ARN_STAGE=arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-Stage

# Backend API URL (GitHub Variable)
BACKEND_URL_STAGE=https://api-stage.example.com

# Frontend URL (GitHub Variable)
FRONTEND_URL_STAGE=https://stage.example.com

# S3 Bucket Name (will be suffixed with -staging)
S3_BUCKET_STAGE=jewelry-frontend-staging

# CloudFront Distribution ID (optional)
CLOUDFRONT_DIST_STAGE=E2345678901BCD


# ============================================
# PRODUCTION ENVIRONMENT
# ============================================

# AWS IAM Role ARN (GitHub Secret)
AWS_ROLE_ARN_PROD=arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-Prod

# Backend API URL (GitHub Variable)
BACKEND_URL_PROD=https://api.example.com

# Frontend URL (GitHub Variable)
FRONTEND_URL_PROD=https://example.com

# S3 Bucket Name (will be suffixed with -production)
S3_BUCKET_PROD=jewelry-frontend-production

# CloudFront Distribution ID (optional)
CLOUDFRONT_DIST_PROD=E3456789012CDE


# ============================================
# SHARED CONFIGURATION
# ============================================

# Base S3 Bucket Name (GitHub Variable)
# The workflow will append -development, -staging, or -production
S3_BUCKET_NAME=jewelry-frontend

# Base CloudFront Distribution ID (GitHub Variable, optional)
# Leave empty if not using CloudFront
# The workflow will append -development, -staging, or -production
CLOUDFRONT_DISTRIBUTION_ID=

# AWS Region (hardcoded in workflow, change if needed)
AWS_REGION=us-east-1

# GitHub Repository (format: owner/repo)
GITHUB_REPO=your-org/your-repo
```

## How to Use This Template

1. **Copy this file** to a secure location (NOT in the repository)
2. **Fill in all values** with your actual configuration
3. **Add to GitHub**:
   - Secrets: Go to Settings → Secrets and variables → Actions → Secrets
   - Variables: Go to Settings → Secrets and variables → Actions → Variables
4. **Delete the filled template** after adding to GitHub (contains sensitive data)

## GitHub Secrets (Add to Secrets tab)

Copy these values from your filled template:

```
AWS_ROLE_ARN_DEV     → from AWS_ROLE_ARN_DEV above
AWS_ROLE_ARN_STAGE   → from AWS_ROLE_ARN_STAGE above
AWS_ROLE_ARN_PROD    → from AWS_ROLE_ARN_PROD above
```

## GitHub Variables (Add to Variables tab)

Copy these values from your filled template:

```
BACKEND_URL_DEV              → from BACKEND_URL_DEV above
BACKEND_URL_STAGE            → from BACKEND_URL_STAGE above
BACKEND_URL_PROD             → from BACKEND_URL_PROD above
S3_BUCKET_NAME               → from S3_BUCKET_NAME above (base name only)
CLOUDFRONT_DISTRIBUTION_ID   → from CLOUDFRONT_DISTRIBUTION_ID above (or leave empty)
FRONTEND_URL_DEV             → from FRONTEND_URL_DEV above
FRONTEND_URL_STAGE           → from FRONTEND_URL_STAGE above
FRONTEND_URL_PROD            → from FRONTEND_URL_PROD above
```

## Validation Checklist

Before adding to GitHub, verify:

- [ ] All URLs start with `https://` (or `http://` for local dev)
- [ ] No trailing slashes on URLs
- [ ] AWS account ID is correct in role ARNs
- [ ] Role names match what you created in AWS
- [ ] S3 bucket names are globally unique
- [ ] CloudFront distribution IDs are correct (if using)
- [ ] GitHub repository format is `owner/repo`
- [ ] No typos in any values

## Example Values

Here's an example of what filled values might look like:

```bash
# Development
AWS_ROLE_ARN_DEV=arn:aws:iam::139984030807:role/github-actions-dev
BACKEND_URL_DEV=https://ewzlv276yh.execute-api.us-east-1.amazonaws.com/dev
FRONTEND_URL_DEV=
S3_BUCKET_NAME=jewelry-frontend-139984030807-staging 
CLOUDFRONT_DISTRIBUTION_ID=E1A2B3C4D5E6F7

# Staging
AWS_ROLE_ARN_STAGE=arn:aws:iam::123456789012:role/arn:aws:iam::139984030807:role/github-actions-stage
BACKEND_URL_STAGE=https://ewzlv276yh.execute-api.us-east-1.amazonaws.com/Stage
FRONTEND_URL_STAGE=

# Production
AWS_ROLE_ARN_PROD=arn:aws:iam::139984030807:role/github-actions-prod
BACKEND_URL_PROD=https://ewzlv276yh.execute-api.us-east-1.amazonaws.com/Prod
FRONTEND_URL_PROD=
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit this file with real values to the repository
- Store filled template in a secure password manager
- Rotate AWS credentials regularly
- Use different AWS accounts for production if possible
- Enable MFA on AWS accounts
- Review IAM permissions regularly

## Next Steps

After filling out and adding to GitHub:

1. Verify all secrets and variables are added correctly
2. Test deployment to development environment first
3. Review workflow logs for any configuration errors
4. Run smoke tests to verify deployment
5. Document any environment-specific notes
6. Share access with team members as needed

## Support

If you need help:
- See `docs/github-secrets-setup.md` for step-by-step instructions
- See `docs/github-actions-setup.md` for complete documentation
- Check `DEPLOYMENT-CHECKLIST.md` for setup verification
