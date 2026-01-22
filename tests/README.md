# Test Suite Documentation

This directory contains integration and smoke tests for the deployment pipeline.

## Test Types

### Integration Tests
**Location**: `integration/backend-integration.test.js`

Tests the frontend's integration with the backend API before deployment.

**What it tests**:
- Backend health endpoint
- Frontend loads correctly
- API configuration in frontend
- CORS configuration
- API endpoints accessibility
- Login endpoint integration

**When it runs**:
- During CI/CD pipeline after build
- Before deployment to any environment
- Can be run locally for development

**Requirements**:
- Backend API must be running and accessible
- Frontend preview server must be running
- Playwright installed

### Smoke Tests
**Location**: `smoke/post-deployment.test.js`

Quick verification tests that run after deployment to ensure everything is working.

**What it tests**:
- Deployment is accessible
- Backend connectivity from deployed frontend
- SSL certificate validation (if HTTPS)
- Page load performance
- Console error detection
- Critical assets loading
- Login page functionality

**When it runs**:
- After successful deployment to any environment
- Can be run manually against any deployed environment

**Requirements**:
- Frontend must be deployed and accessible
- Backend API must be running and accessible
- Playwright installed

**Output**:
- JSON results file
- HTML report with visual summary

## Running Tests Locally

### Prerequisites

Install dependencies:
```bash
npm ci
```

Install Playwright browsers:
```bash
npx playwright install --with-deps chromium
```

### Integration Tests

1. Build the application:
```bash
npm run build
```

2. Start preview server:
```bash
npm run preview
```

3. In another terminal, run integration tests:
```bash
BACKEND_URL=https://api-dev.example.com \
FRONTEND_URL=http://localhost:4173 \
node tests/integration/backend-integration.test.js
```

4. Stop preview server when done:
```bash
pkill -f "vite preview"
```

### Smoke Tests

Run against any deployed environment:

```bash
BACKEND_URL=https://api.example.com \
FRONTEND_URL=https://example.com \
node tests/smoke/post-deployment.test.js
```

View the HTML report:
```bash
open tests/smoke/results/smoke-test-report.html
```

## Environment Variables

### Integration Tests

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Backend API URL | `https://api-dev.example.com` |
| `FRONTEND_URL` | Frontend URL (preview server) | `http://localhost:4173` |

### Smoke Tests

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Backend API URL | `https://api.example.com` |
| `FRONTEND_URL` | Deployed frontend URL | `https://example.com` |

## Test Results

### Integration Tests

Results are saved to:
- `integration/results/integration-test-results.json`

Example output:
```json
{
  "passed": 5,
  "failed": 1,
  "tests": [
    {
      "name": "Backend Health",
      "passed": true,
      "message": "Backend is healthy"
    },
    ...
  ]
}
```

### Smoke Tests

Results are saved to:
- `smoke/results/smoke-test-results.json` - JSON results
- `smoke/results/smoke-test-report.html` - Visual HTML report

Example JSON output:
```json
{
  "passed": 6,
  "failed": 1,
  "timestamp": "2024-01-22T10:30:00.000Z",
  "tests": [
    {
      "name": "Deployment Accessible",
      "passed": true,
      "message": "Deployment accessible (200)"
    },
    ...
  ]
}
```

## Exit Codes

Both test suites use standard exit codes:
- `0` - All tests passed
- `1` - One or more tests failed

This allows CI/CD pipelines to fail appropriately when tests don't pass.

## Debugging Tests

### Enable Verbose Logging

Tests log to console with timestamps. Watch for:
- `✓` - Test passed
- `✗` - Test failed
- `⚠` - Warning

### Common Issues

#### Integration Tests

**Issue**: "Backend not accessible"
- Check backend URL is correct
- Verify backend is running
- Check network connectivity
- Verify CORS configuration

**Issue**: "Frontend failed to load"
- Check preview server is running on correct port
- Verify build completed successfully
- Check for build errors

**Issue**: "CORS test failed"
- Verify backend CORS configuration allows frontend origin
- Check backend CORS headers

#### Smoke Tests

**Issue**: "Deployment not accessible"
- Verify deployment completed successfully
- Check frontend URL is correct
- Verify DNS is configured (if custom domain)
- Check CloudFront distribution status

**Issue**: "Backend connectivity failed"
- Verify backend is running
- Check backend URL is correct
- Verify CORS allows deployed frontend origin

**Issue**: "SSL certificate error"
- Verify SSL certificate is valid
- Check certificate expiration
- Verify domain matches certificate

## Extending Tests

### Adding New Integration Tests

Add new test functions to `integration/backend-integration.test.js`:

```javascript
async function testNewFeature(page) {
  log('Testing new feature...');
  
  try {
    // Your test logic here
    
    return { passed: true, message: 'Test passed' };
  } catch (error) {
    return { passed: false, message: error.message };
  }
}

// Add to tests array in runTests()
const tests = [
  // ... existing tests
  { name: 'New Feature', fn: () => testNewFeature(page) }
];
```

### Adding New Smoke Tests

Add new test functions to `smoke/post-deployment.test.js`:

```javascript
async function testNewCheck(page) {
  log('Testing new check...');
  
  try {
    // Your test logic here
    
    return { passed: true, message: 'Check passed' };
  } catch (error) {
    return { passed: false, message: error.message };
  }
}

// Add to tests array in runSmokeTests()
const tests = [
  // ... existing tests
  { name: 'New Check', fn: () => testNewCheck(page) }
];
```

## CI/CD Integration

### GitHub Actions

Tests are automatically run in the deployment workflow:

1. **Integration Tests** - Run after build, before deployment
2. **Smoke Tests** - Run after deployment

Test results are uploaded as artifacts:
- `integration-test-results-{env}`
- `smoke-test-results-{env}`

### Viewing Results in CI/CD

1. Go to Actions tab in GitHub
2. Click on workflow run
3. Scroll to "Artifacts" section
4. Download test results
5. Open HTML report (smoke tests only)

## Best Practices

1. **Run integration tests locally** before pushing
2. **Check smoke test reports** after deployment
3. **Add tests for new features** as they're developed
4. **Keep tests fast** - aim for < 2 minutes total
5. **Make tests reliable** - avoid flaky tests
6. **Use meaningful test names** for easy debugging
7. **Log important information** for troubleshooting

## Maintenance

### Updating Playwright

```bash
npm update playwright @playwright/test
npx playwright install --with-deps chromium
```

### Updating Test Dependencies

Tests use Node.js built-in modules and Playwright. Update Playwright regularly for:
- Security patches
- Browser compatibility
- New features

### Test Review Schedule

- **Weekly**: Review test results for patterns
- **Monthly**: Update tests for new features
- **Quarterly**: Review and optimize test performance

## Support

For issues with tests:
1. Check test logs for specific errors
2. Review this documentation
3. Check `docs/github-actions-setup.md` for CI/CD issues
4. Review Playwright documentation for browser automation issues

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
