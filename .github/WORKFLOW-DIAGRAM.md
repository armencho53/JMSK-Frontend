# GitHub Actions Workflow Diagram

## Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         TRIGGER EVENT                            │
├─────────────────────────────────────────────────────────────────┤
│  • Push to develop/staging/main                                  │
│  • Pull Request                                                  │
│  • Manual Workflow Dispatch                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              JOB 1: Determine Environment                        │
├─────────────────────────────────────────────────────────────────┤
│  • Identify target environment (dev/staging/prod)                │
│  • Set AWS role ARN                                             │
│  • Set backend URL                                              │
│  • Set frontend URL                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JOB 2: Build                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Checkout code                                               │
│  2. Setup Node.js 20                                            │
│  3. Install dependencies (npm ci)                               │
│  4. Run linter (npm run lint)                                   │
│  5. Run unit tests (npm run test:coverage)                      │
│  6. Build application with env-specific backend URL             │
│  7. Upload build artifacts                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              JOB 3: Integration Test                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Download build artifacts                                    │
│  2. Start preview server (npm run preview)                      │
│  3. Install Playwright                                          │
│  4. Run integration tests:                                      │
│     • Backend health check                                      │
│     • Frontend loads correctly                                  │
│     • API configuration                                         │
│     • CORS configuration                                        │
│     • API endpoints accessibility                               │
│     • Login endpoint integration                                │
│  5. Upload test results                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ┌────┴────┐
                    │ PR?     │
                    └────┬────┘
                         │
              ┌──────────┴──────────┐
              │                     │
             YES                   NO
              │                     │
              ▼                     ▼
         ┌─────────┐    ┌─────────────────────────────────────────┐
         │  STOP   │    │         JOB 4: Deploy                    │
         │ (No     │    ├─────────────────────────────────────────┤
         │ Deploy) │    │  1. Download build artifacts            │
         └─────────┘    │  2. Configure AWS credentials (OIDC)    │
                        │  3. Sync files to S3:                   │
                        │     • Assets with long cache (1 year)   │
                        │     • HTML with no cache                │
                        │  4. Invalidate CloudFront cache         │
                        │  5. Generate deployment summary         │
                        └────────────┬────────────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────────────────────┐
                        │       JOB 5: Smoke Test                  │
                        ├─────────────────────────────────────────┤
                        │  1. Install Playwright                  │
                        │  2. Run smoke tests:                    │
                        │     • Deployment accessible             │
                        │     • Backend connectivity              │
                        │     • SSL certificate valid             │
                        │     • Page load performance             │
                        │     • No console errors                 │
                        │     • Critical assets load              │
                        │     • Login page accessible             │
                        │  3. Generate HTML report                │
                        │  4. Upload test results                 │
                        └────────────┬────────────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────────────────────┐
                        │          DEPLOYMENT COMPLETE             │
                        └─────────────────────────────────────────┘
```

## Environment Mapping

```
┌──────────────┬──────────────┬─────────────────────┬──────────────────────┐
│   Branch     │ Environment  │   AWS Role Secret   │  Backend URL Var     │
├──────────────┼──────────────┼─────────────────────┼──────────────────────┤
│   develop    │ development  │ AWS_ROLE_ARN_DEV    │ BACKEND_URL_DEV      │
│   staging    │ staging      │ AWS_ROLE_ARN_STAGE  │ BACKEND_URL_STAGE    │
│   main       │ production   │ AWS_ROLE_ARN_PROD   │ BACKEND_URL_PROD     │
└──────────────┴──────────────┴─────────────────────┴──────────────────────┘
```

## AWS Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Actions                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Workflow Runner                                            │    │
│  │  • Builds application                                       │    │
│  │  • Runs tests                                              │    │
│  │  • Authenticates via OIDC                                  │    │
│  └────────────────────────┬───────────────────────────────────┘    │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                            │ OIDC Authentication
                            │ (No long-lived credentials)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          AWS Account                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  IAM OIDC Provider                                           │  │
│  │  • Validates GitHub token                                    │  │
│  │  • Issues temporary credentials                              │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  IAM Role (per environment)                                  │  │
│  │  • GitHubActions-Dev                                         │  │
│  │  • GitHubActions-Stage                                       │  │
│  │  • GitHubActions-Prod                                        │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                            │                                         │
│              ┌─────────────┴─────────────┐                          │
│              │                           │                          │
│              ▼                           ▼                          │
│  ┌─────────────────────┐    ┌─────────────────────────┐            │
│  │  S3 Bucket          │    │  CloudFront (optional)  │            │
│  │  • Static files     │◄───│  • CDN distribution     │            │
│  │  • Versioning       │    │  • SSL/TLS              │            │
│  │  • Website hosting  │    │  • Cache invalidation   │            │
│  └─────────────────────┘    └─────────────────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
                    ┌───────────────┐
                    │   End Users   │
                    └───────────────┘
```

## Test Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Unit Tests                                  │
│  • Component tests                                              │
│  • API client tests                                             │
│  • Utility function tests                                       │
│  • Coverage reporting                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Integration Tests                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Frontend (Preview Server)                                │  │
│  │  • Playwright browser automation                          │  │
│  │  • Tests frontend-backend integration                     │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                            │                                     │
│                            │ HTTP Requests                       │
│                            ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Backend API                                              │  │
│  │  • Health checks                                          │  │
│  │  • Endpoint validation                                    │  │
│  │  • CORS verification                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    Deployment
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Smoke Tests                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Deployed Frontend                                        │  │
│  │  • Accessibility check                                    │  │
│  │  • Performance check                                      │  │
│  │  • Error detection                                        │  │
│  │  • Asset loading                                          │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                            │                                     │
│                            │ HTTP Requests                       │
│                            ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Production Backend                                       │  │
│  │  • Connectivity check                                     │  │
│  │  • API integration                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Artifact Flow

```
Build Job
    │
    ├─► dist/ (build output)
    │       │
    │       ├─► Integration Test Job (downloads)
    │       │       │
    │       │       └─► Tests against preview server
    │       │
    │       └─► Deploy Job (downloads)
    │               │
    │               └─► Uploads to S3
    │
    ├─► coverage/ (test coverage)
    │       │
    │       └─► Uploaded as artifact
    │
    └─► junit.xml (test results)
            │
            └─► Uploaded as artifact

Integration Test Job
    │
    └─► integration-test-results.json
            │
            └─► Uploaded as artifact

Smoke Test Job
    │
    ├─► smoke-test-results.json
    │       │
    │       └─► Uploaded as artifact
    │
    └─► smoke-test-report.html
            │
            └─► Uploaded as artifact
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow                                         │
│  • No AWS credentials stored                                    │
│  • Uses OIDC token from GitHub                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 1. Request token
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub OIDC Provider                                            │
│  • Issues JWT token                                             │
│  • Token contains repo, branch, workflow info                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 2. Present token
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AWS IAM OIDC Provider                                           │
│  • Validates token signature                                    │
│  • Checks token claims (repo, branch)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 3. Token valid?
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AWS IAM Role                                                    │
│  • Assumes role with trust policy                               │
│  • Issues temporary credentials (15 min - 1 hour)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 4. Use temporary credentials
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AWS Services (S3, CloudFront)                                   │
│  • Validates credentials                                        │
│  • Checks IAM permissions                                       │
│  • Allows/denies actions                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Legend

```
┌─────┐
│ Box │  = Process or Component
└─────┘

   │
   ▼     = Flow direction

  ┌┴┐
  │?│   = Decision point
  └┬┘
```

## Quick Reference

- **Workflow File**: `.github/workflows/deploy.yml`
- **Integration Tests**: `tests/integration/backend-integration.test.js`
- **Smoke Tests**: `tests/smoke/post-deployment.test.js`
- **Documentation**: `docs/github-actions-setup.md`
