#!/usr/bin/env node

/**
 * Post-Deployment API Integration Tests
 * 
 * Verifies the deployed backend API is reachable, CORS is configured,
 * and all critical endpoints respond correctly.
 * 
 * Catches:
 * - CORS misconfigurations (missing Access-Control-Allow-Origin)
 * - API Gateway routing issues (404s on valid paths)
 * - Backend deployment failures (5xx errors)
 * - Endpoint path mismatches between frontend and backend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
const RESULTS_DIR = path.join(__dirname, 'results');

if (!BACKEND_URL) {
  console.error('Error: BACKEND_URL environment variable is required');
  process.exit(1);
}

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const results = { passed: 0, failed: 0, tests: [], timestamp: new Date().toISOString() };

function log(msg, type = 'info') {
  const prefix = { info: '✓', error: '✗', warn: '⚠' }[type] || 'ℹ';
  console.log(`${prefix} ${msg}`);
}

function record(name, result) {
  results.tests.push({ name, ...result });
  if (result.passed) results.passed++; else results.failed++;
  log(`${name}: ${result.message}`, result.passed ? 'info' : 'error');
}


// ---------------------------------------------------------------------------
// Test: Backend health endpoint
// ---------------------------------------------------------------------------
async function testBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (res.ok) return { passed: true, message: `Health OK (${res.status})` };
    return { passed: false, message: `Health returned ${res.status}` };
  } catch (e) {
    return { passed: false, message: `Unreachable: ${e.message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: CORS preflight (OPTIONS) on a protected endpoint
// Simulates what the browser does before sending the real request.
// ---------------------------------------------------------------------------
async function testCORSPreflight(endpoint) {
  const url = `${BACKEND_URL}/api/v1${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization,Content-Type'
      }
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    const allowMethods = res.headers.get('access-control-allow-methods');

    if (!allowOrigin) {
      return { passed: false, message: `OPTIONS ${endpoint} — missing Access-Control-Allow-Origin header (status ${res.status})` };
    }
    if (res.status >= 400 && res.status !== 403) {
      return { passed: false, message: `OPTIONS ${endpoint} — status ${res.status}` };
    }
    return { passed: true, message: `OPTIONS ${endpoint} — CORS OK (origin: ${allowOrigin}, methods: ${allowMethods})` };
  } catch (e) {
    return { passed: false, message: `OPTIONS ${endpoint} — ${e.message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: Actual GET request returns a valid status (401 = auth required = OK,
// 200 = public endpoint = OK, 404/5xx = broken).
// Also verifies CORS headers are present on the response.
// ---------------------------------------------------------------------------
async function testEndpointReachable(endpoint) {
  const url = `${BACKEND_URL}/api/v1${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Accept': 'application/json'
      }
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    const status = res.status;

    // 401/403 means the endpoint exists but requires auth — that's fine
    if (status === 200 || status === 401 || status === 403) {
      if (!allowOrigin) {
        return { passed: false, message: `GET ${endpoint} — ${status} but missing CORS header` };
      }
      return { passed: true, message: `GET ${endpoint} — ${status} with CORS OK` };
    }

    if (status === 404) {
      return { passed: false, message: `GET ${endpoint} — 404 Not Found (route missing or API Gateway misconfigured)` };
    }

    return { passed: false, message: `GET ${endpoint} — unexpected status ${status}` };
  } catch (e) {
    return { passed: false, message: `GET ${endpoint} — ${e.message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: Login endpoint accepts form-urlencoded POST (matches frontend usage)
// ---------------------------------------------------------------------------
async function testLoginEndpoint() {
  const url = `${BACKEND_URL}/api/v1/auth/login`;
  try {
    const body = new URLSearchParams({ username: 'test@test.com', password: 'wrong' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': FRONTEND_ORIGIN
      },
      body
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    const status = res.status;

    // 401/400 = endpoint works, creds are wrong (expected)
    if ((status === 401 || status === 400) && allowOrigin) {
      return { passed: true, message: `POST /auth/login — ${status} with CORS OK (auth rejected as expected)` };
    }
    if (status === 200 && allowOrigin) {
      return { passed: true, message: `POST /auth/login — 200 with CORS OK` };
    }
    if (!allowOrigin) {
      return { passed: false, message: `POST /auth/login — ${status} but missing CORS header` };
    }
    return { passed: false, message: `POST /auth/login — unexpected status ${status}` };
  } catch (e) {
    return { passed: false, message: `POST /auth/login — ${e.message}` };
  }
}


// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

// Every endpoint the frontend calls (from pages/*.tsx and lib/api.ts)
const CRITICAL_ENDPOINTS = [
  '/orders/',
  '/supplies/',
  '/shipments/',
  '/departments/',
  '/roles/',
  '/contacts/',
  '/companies/',
  '/manufacturing/steps',
  '/lookup-values/',
];

async function run() {
  log(`\nAPI Integration Tests`);
  log(`Backend:  ${BACKEND_URL}`);
  log(`Origin:   ${FRONTEND_ORIGIN}\n`);

  // 1. Health check
  record('Backend Health', await testBackendHealth());

  // 2. Login endpoint (POST with form data)
  record('Login Endpoint', await testLoginEndpoint());

  // 3. For each critical endpoint: test CORS preflight + GET reachability
  for (const ep of CRITICAL_ENDPOINTS) {
    record(`CORS Preflight ${ep}`, await testCORSPreflight(ep));
    record(`Endpoint ${ep}`, await testEndpointReachable(ep));
  }

  // Save results JSON
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'api-integration-results.json'),
    JSON.stringify(results, null, 2)
  );

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`API Integration: ${results.passed} passed, ${results.failed} failed out of ${results.tests.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (results.failed > 0) {
    console.log('Failed tests:');
    results.tests.filter(t => !t.passed).forEach(t => console.log(`  ✗ ${t.name}: ${t.message}`));
    console.log('');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
