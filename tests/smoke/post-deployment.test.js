#!/usr/bin/env node

/**
 * Post-Deployment Smoke Tests
 * Quick tests to verify deployment was successful
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const RESULTS_DIR = path.join(__dirname, 'results');

if (!BACKEND_URL || !FRONTEND_URL) {
  console.error('Error: BACKEND_URL and FRONTEND_URL environment variables are required');
  process.exit(1);
}

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const results = {
  passed: 0,
  failed: 0,
  tests: [],
  timestamp: new Date().toISOString()
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '✓',
    error: '✗',
    warn: '⚠'
  }[type] || 'ℹ';
  
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

async function testDeploymentAccessible() {
  log('Testing if deployment is accessible...');
  
  try {
    const response = await fetch(FRONTEND_URL, {
      method: 'GET',
      headers: { 'User-Agent': 'Smoke-Test/1.0' }
    });
    
    if (response.ok) {
      log('Deployment is accessible', 'info');
      return { passed: true, message: `Deployment accessible (${response.status})` };
    } else {
      log(`Deployment returned status ${response.status}`, 'error');
      return { passed: false, message: `HTTP ${response.status}` };
    }
  } catch (error) {
    log(`Deployment not accessible: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testBackendConnectivity() {
  log('Testing backend connectivity...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'Smoke-Test/1.0' }
    });
    
    if (response.ok) {
      log('Backend is reachable', 'info');
      return { passed: true, message: 'Backend connectivity verified' };
    } else {
      log(`Backend returned status ${response.status}`, 'error');
      return { passed: false, message: `Backend HTTP ${response.status}` };
    }
  } catch (error) {
    log(`Backend not reachable: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testPageLoad(page) {
  log('Testing page load performance...');
  
  try {
    const startTime = Date.now();
    await page.goto(FRONTEND_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    
    log(`Page loaded in ${loadTime}ms`, 'info');
    
    if (loadTime < 10000) {
      return { passed: true, message: `Page loaded in ${loadTime}ms` };
    } else {
      return { passed: false, message: `Page load too slow: ${loadTime}ms` };
    }
  } catch (error) {
    log(`Page load failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testNoConsoleErrors(page) {
  log('Testing for console errors...');
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for any async errors
    
    if (errors.length === 0) {
      log('No console errors detected', 'info');
      return { passed: true, message: 'No console errors' };
    } else {
      log(`Found ${errors.length} console errors`, 'warn');
      return { 
        passed: false, 
        message: `${errors.length} console errors detected`,
        details: errors.slice(0, 5) // First 5 errors
      };
    }
  } catch (error) {
    log(`Console error test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testCriticalAssets(page) {
  log('Testing critical assets load...');
  
  const failedResources = [];
  
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    
    // Check for failed critical resources
    if (status >= 400 && (
      url.endsWith('.js') || 
      url.endsWith('.css') || 
      url.includes('/assets/')
    )) {
      failedResources.push({ url, status });
    }
  });
  
  try {
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
    
    if (failedResources.length === 0) {
      log('All critical assets loaded successfully', 'info');
      return { passed: true, message: 'All assets loaded' };
    } else {
      log(`${failedResources.length} assets failed to load`, 'error');
      return { 
        passed: false, 
        message: `${failedResources.length} assets failed`,
        details: failedResources
      };
    }
  } catch (error) {
    log(`Asset test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testLoginPageAccessible(page) {
  log('Testing login page accessibility...');
  
  try {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle' });
    
    const hasEmailInput = await page.locator('input[type="email"]').count() > 0;
    const hasPasswordInput = await page.locator('input[type="password"]').count() > 0;
    const hasSubmitButton = await page.locator('button[type="submit"]').count() > 0;
    
    if (hasEmailInput && hasPasswordInput && hasSubmitButton) {
      log('Login page is properly rendered', 'info');
      return { passed: true, message: 'Login page accessible and functional' };
    } else {
      log('Login page is missing required elements', 'error');
      return { 
        passed: false, 
        message: 'Login page incomplete',
        details: { hasEmailInput, hasPasswordInput, hasSubmitButton }
      };
    }
  } catch (error) {
    log(`Login page test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testSSLCertificate() {
  log('Testing SSL certificate (if HTTPS)...');
  
  if (!FRONTEND_URL.startsWith('https://')) {
    log('Skipping SSL test (not HTTPS)', 'warn');
    return { passed: true, message: 'Skipped (HTTP)' };
  }
  
  try {
    const response = await fetch(FRONTEND_URL, {
      method: 'HEAD'
    });
    
    if (response.ok) {
      log('SSL certificate is valid', 'info');
      return { passed: true, message: 'Valid SSL certificate' };
    } else {
      return { passed: false, message: 'SSL validation failed' };
    }
  } catch (error) {
    if (error.message.includes('certificate')) {
      log(`SSL certificate error: ${error.message}`, 'error');
      return { passed: false, message: 'Invalid SSL certificate' };
    }
    return { passed: false, message: error.message };
  }
}

async function runSmokeTests() {
  log('Starting post-deployment smoke tests...');
  log(`Frontend URL: ${FRONTEND_URL}`);
  log(`Backend URL: ${BACKEND_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Smoke-Test/1.0'
  });
  const page = await context.newPage();
  
  try {
    // Run all smoke tests
    const tests = [
      { name: 'Deployment Accessible', fn: () => testDeploymentAccessible() },
      { name: 'Backend Connectivity', fn: () => testBackendConnectivity() },
      { name: 'SSL Certificate', fn: () => testSSLCertificate() },
      { name: 'Page Load Performance', fn: () => testPageLoad(page) },
      { name: 'No Console Errors', fn: () => testNoConsoleErrors(page) },
      { name: 'Critical Assets Load', fn: () => testCriticalAssets(page) },
      { name: 'Login Page Accessible', fn: () => testLoginPageAccessible(page) }
    ];
    
    for (const test of tests) {
      log(`\n--- Running: ${test.name} ---`);
      const result = await test.fn();
      
      results.tests.push({
        name: test.name,
        ...result
      });
      
      if (result.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    }
    
  } finally {
    await browser.close();
  }
  
  // Save results
  const resultsFile = path.join(RESULTS_DIR, 'smoke-test-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(results);
  fs.writeFileSync(path.join(RESULTS_DIR, 'smoke-test-report.html'), htmlReport);
  
  // Print summary
  log('\n=== Smoke Test Summary ===');
  log(`Total: ${results.tests.length}`);
  log(`Passed: ${results.passed}`, 'info');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'info');
  
  results.tests.forEach(test => {
    const status = test.passed ? '✓' : '✗';
    log(`${status} ${test.name}: ${test.message}`);
  });
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

function generateHTMLReport(results) {
  const passRate = ((results.passed / results.tests.length) * 100).toFixed(1);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Smoke Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { flex: 1; padding: 20px; border-radius: 8px; text-align: center; }
    .stat.passed { background: #d4edda; color: #155724; }
    .stat.failed { background: #f8d7da; color: #721c24; }
    .stat.total { background: #d1ecf1; color: #0c5460; }
    .stat h2 { margin: 0; font-size: 36px; }
    .stat p { margin: 5px 0 0 0; }
    .test { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
    .test.passed { background: #d4edda; border-color: #28a745; }
    .test.failed { background: #f8d7da; border-color: #dc3545; }
    .test h3 { margin: 0 0 5px 0; }
    .test p { margin: 5px 0; color: #666; }
    .details { background: #f8f9fa; padding: 10px; margin-top: 10px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔥 Smoke Test Report</h1>
    <p><strong>Timestamp:</strong> ${results.timestamp}</p>
    <p><strong>Frontend:</strong> ${FRONTEND_URL}</p>
    <p><strong>Backend:</strong> ${BACKEND_URL}</p>
    
    <div class="summary">
      <div class="stat total">
        <h2>${results.tests.length}</h2>
        <p>Total Tests</p>
      </div>
      <div class="stat passed">
        <h2>${results.passed}</h2>
        <p>Passed (${passRate}%)</p>
      </div>
      <div class="stat failed">
        <h2>${results.failed}</h2>
        <p>Failed</p>
      </div>
    </div>
    
    <h2>Test Results</h2>
    ${results.tests.map(test => `
      <div class="test ${test.passed ? 'passed' : 'failed'}">
        <h3>${test.passed ? '✓' : '✗'} ${test.name}</h3>
        <p>${test.message}</p>
        ${test.details ? `<div class="details"><pre>${JSON.stringify(test.details, null, 2)}</pre></div>` : ''}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `;
}

// Run smoke tests
runSmokeTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
