#!/bin/bash
# ============================================================================
# DEPRECATED DEPLOYMENT SCRIPT - BACKUP USE ONLY
# ============================================================================
# This script is deprecated and maintained for emergency backup purposes only.
# 
# RECOMMENDED: Use GitHub Actions workflows for automated deployment
#   - Automated: Push to main branch (deploys after backend)
#   - Manual: gh workflow run deploy-frontend.yml -f environment=prod
#   - Workflows: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions
#
# MIGRATION: See MIGRATION-GUIDE.md for migration instructions
# BACKUP DOCS: See MANUAL-DEPLOYMENT-BACKUP.md for emergency procedures
# ============================================================================

set -e

echo "⚠️  DEPRECATION NOTICE"
echo "======================"
echo "This manual deployment script is deprecated and maintained for backup purposes only."
echo "The recommended deployment method is now GitHub Actions workflows."
echo ""
echo "🔄 Recommended: Use GitHub Actions"
echo "   • Automated deployment: Push to main branch (deploys after backend)"
echo "   • Manual deployment: gh workflow run deploy-frontend.yml -f environment=prod"
echo "   • View workflows: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo ""
echo "📖 Migration Guide: See MIGRATION-GUIDE.md for differences and benefits"
echo ""
read -p "Continue with manual deployment? (y/N): " CONTINUE_MANUAL
if [[ ! "$CONTINUE_MANUAL" =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled. Use GitHub Actions for automated deployment."
    exit 0
fi
echo ""

echo "🚀 Complete Frontend Deployment - Jewelry Manufacturing System"
echo "==============================================================="
echo ""

# Check prerequisites
if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Get deployment parameters
echo "📋 Deployment Configuration"
echo "----------------------------"
read -p "Enter your backend API URL (e.g., https://xxx.execute-api.us-east-1.amazonaws.com/prod): " API_URL

if [ -z "$API_URL" ]; then
    echo "❌ Backend API URL is required"
    echo "   Deploy backend first with: cd ../backend && ./deploy.sh"
    exit 1
fi

read -p "Enter stage (dev/staging/prod) [prod]: " STAGE
STAGE=${STAGE:-prod}

echo ""
echo "📦 Step 1/5: Creating AWS infrastructure (S3 + CloudFront)..."
sam deploy --config-env $STAGE --no-fail-on-empty-changeset

echo ""
echo "✅ Infrastructure created!"

# Get bucket and distribution info
BUCKET=$(aws cloudformation describe-stacks \
    --stack-name jewelry-frontend-$STAGE \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text 2>/dev/null || echo "")

DIST_ID=$(aws cloudformation describe-stacks \
    --stack-name jewelry-frontend-$STAGE \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name jewelry-frontend-$STAGE \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendUrl`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
    echo "❌ Failed to get S3 bucket name"
    exit 1
fi

echo ""
echo "🔧 Step 2/5: Building React application..."
echo "   API URL: $API_URL"
export VITE_API_URL=$API_URL
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo ""
echo "✅ Build complete!"

echo ""
echo "📤 Step 3/5: Uploading to S3..."
echo "   Bucket: $BUCKET"
aws s3 sync dist/ s3://$BUCKET --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html"
aws s3 cp dist/index.html s3://$BUCKET/index.html --cache-control "public, max-age=0, must-revalidate"

echo ""
echo "✅ Upload complete!"

echo ""
echo "🔄 Step 4/5: Invalidating CloudFront cache..."
if [ -n "$DIST_ID" ]; then
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $DIST_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    echo "   Invalidation ID: $INVALIDATION_ID"
    echo "✅ Cache invalidation started!"
else
    echo "⚠️  Could not get distribution ID"
fi

echo ""
echo "🧪 Step 5/5: Testing deployment..."
if [ -n "$CLOUDFRONT_URL" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$CLOUDFRONT_URL" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Frontend is accessible!"
    else
        echo "⚠️  Frontend returned HTTP $HTTP_CODE (may take a few minutes to propagate)"
    fi
fi

echo ""
echo "==============================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "==============================================================="
echo ""
echo "📋 Deployment Summary:"
echo "   Stage: $STAGE"
echo "   Stack: jewelry-frontend-$STAGE"
echo "   S3 Bucket: $BUCKET"
if [ -n "$CLOUDFRONT_URL" ]; then
    echo "   CloudFront URL: https://$CLOUDFRONT_URL"
fi
echo "   Backend API: $API_URL"
echo ""
echo "🌐 Access your application:"
if [ -n "$CLOUDFRONT_URL" ]; then
    echo "   https://$CLOUDFRONT_URL"
else
    echo "   Check CloudFormation outputs for URL"
fi
echo ""
echo "⚠️  IMPORTANT: Consider migrating to GitHub Actions"
echo "   • Automated frontend deployment after backend completion"
echo "   • No manual API URL coordination required"
echo "   • Integrated testing and cache invalidation"
echo "   • See MIGRATION-GUIDE.md for migration steps"
echo ""
echo "⏱️  Note: CloudFront distribution may take 5-15 minutes to fully deploy"
echo ""
echo "📝 Next Steps:"
echo "   1. Open the CloudFront URL in your browser"
echo "   2. Register a new user"
echo "   3. Start using the application!"
echo ""
echo "📊 View stack details:"
echo "   aws cloudformation describe-stacks --stack-name jewelry-frontend-$STAGE"
echo ""
