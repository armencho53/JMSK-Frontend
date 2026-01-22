#!/usr/bin/env node

/**
 * Backend Integration Tests
 * Tests the frontend's integration with the backend API
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';
const RESULTS_DIR = path.join(__dirname, 'results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const results = {
  passed: 0,
  failed: 0,
  tests: []
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

async function testBackendHealth() {
  log('Testing backend health endpoint...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    
    if (response.ok) {
      log('Backend health check passed', 'info');
      return { passed: true, message: 'Backend is healthy' };
    } else {
      log(`Backend health check failed: ${response.status}`, 'error');
      return { passed: false, message: `Backend returned status ${response.status}` };
    }
  } catch (error) {
    log(`Backend health check failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testFrontendLoads(page) {
  log('Testing frontend loads...');
  
  try {
    const response = await page.goto(FRONTEND_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (response.ok()) {
      log('Frontend loaded successfully', 'info');
      return { passed: true, message: 'Frontend loads correctly' };
    } else {
      log(`Frontend failed to load: ${response.status()}`, 'error');
      return { passed: false, message: `Frontend returned status ${response.status()}` };
    }
  } catch (error) {
    log(`Frontend load failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testAPIConfiguration(page) {
  log('Testing API configuration...');
  
  try {
    await page.goto(FRONTEND_URL);
    
    // Check if API URL is correctly configured
    const apiUrl = await page.evaluate(() => {
      return window.localStorage.getItem('apiUrl') || 
             (window as any).VITE_API_URL || 
             import.meta.env.VITE_API_URL;
    });
    
    if (apiUrl && apiUrl.includes(BACKEND_URL.replace(/^https?:\/\//, ''))) {
      log('API configuration is correct', 'info');
      return { passed: true, message: 'API URL is correctly configured' };
    } else {
      log(`API configuration mismatch. Expected: ${BACKEND_URL}, Got: ${apiUrl}`, 'warn');
      return { passed: false, message: `API URL mismatch: ${apiUrl}` };
    }
  } catch (error) {
    log(`API configuration test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testLoginEndpoint(page) {
  log('Testing login endpoint integration...');
  
  try {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    
    // Intercept API call
    const [response] = await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/auth/login') || response.url().includes('/login'),
        { timeout: 10000 }
      ),
      page.click('button[type="submit"]')
    ]);
    
    const status = response.status();
    
    if (status === 200 || status === 401 || status === 400) {
      log('Login endpoint is reachable and responding', 'info');
      return { passed: true, message: `Login endpoint responded with status ${status}` };
    } else {
      log(`Login endpoint returned unexpected status: ${status}`, 'warn');
      return { passed: false, message: `Unexpected status: ${status}` };
    }
  } catch (error) {
    log(`Login endpoint test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function testAPIEndpoints(page) {
  log('Testing API endpoints accessibility...');
  
  const endpoints = [
    '/api/customers',
    '/api/orders',
    '/api/companies',
    '/api/roles'
  ];
  
  const endpointResults = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 401 is acceptable (not authenticated), 200 is good, 404 means endpoint doesn't exist
      if (response.status === 200 || response.status === 401 || response.status === 403) {
        log(`Endpoint ${endpoint} is accessible`, 'info');
        endpointResults.push({ endpoint, status: response.status, accessible: true });
      } else {
        log(`Endpoint ${endpoint} returned status ${response.status}`, 'warn');
        endpointResults.push({ endpoint, status: response.status, accessible: false });
      }
    } catch (error) {
      log(`Endpoint ${endpoint} failed: ${error.message}`, 'error');
      endpointResults.push({ endpoint, error: error.message, accessible: false });
    }
  }
  
  const allAccessible = endpointResults.every(r => r.accessible);
  
  return {
    passed: allAccessible,
    message: `${endpointResults.filter(r => r.accessible).length}/${endpoints.length} endpoints accessible`,
    details: endpointResults
  };
}

async function testCORSConfiguration(page) {
  log('Testing CORS configuration...');
  
  try {
    await page.goto(FRONTEND_URL);
    
    const corsTest = await page.evaluate(async (backendUrl) => {
      try {
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        return {
          success: true,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }, BACKEND_URL);
    
    if (corsTest.success) {
      log('CORS is properly configured', 'info');
      return { passed: true, message: 'CORS allows frontend to access backend' };
    } else {
      log(`CORS test failed: ${corsTest.error}`, 'error');
      return { passed: false, message: corsTest.error };
    }
  } catch (error) {
    log(`CORS test failed: ${error.message}`, 'error');
    return { passed: false, message: error.message };
  }
}

async function runTests() {
  log('Starting backend integration tests...');
  log(`Backend URL: ${BACKEND_URL}`);
  log(`Frontend URL: ${FRONTEND_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  // Enable console logging from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      log(`Browser console error: ${msg.text()}`, 'warn');
    }
  });
  
  try {
    // Run all tests
    const tests = [
      { name: 'Backend Health', fn: () => testBackendHealth() },
      { name: 'Frontend Loads', fn: () => testFrontendLoads(page) },
      { name: 'API Configuration', fn: () => testAPIConfiguration(page) },
      { name: 'CORS Configuration', fn: () => testCORSConfiguration(page) },
      { name: 'API Endpoints', fn: () => testAPIEndpoints(page) },
      { name: 'Login Endpoint', fn: () => testLoginEndpoint(page) }
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
  const resultsFile = path.join(RESULTS_DIR, 'integration-test-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  
  // Print summary
  log('\n=== Test Summary ===');
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

// Run tests
runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
