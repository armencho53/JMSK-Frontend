#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes the production bundle to identify optimization opportunities
 * for the jewelry manufacturing application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize() {
  console.log(colorize('\n🔍 Analyzing Bundle Size...', 'cyan'));
  
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.log(colorize('❌ No dist folder found. Run "npm run build" first.', 'red'));
    return;
  }
  
  const stats = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    fontSize: 0,
    otherSize: 0,
    files: [],
  };
  
  function analyzeDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(filePath, `${prefix}${file}/`);
      } else {
        const size = stat.size;
        const ext = path.extname(file).toLowerCase();
        const relativePath = `${prefix}${file}`;
        
        stats.totalSize += size;
        stats.files.push({ path: relativePath, size, ext });
        
        // Categorize by file type
        if (['.js', '.mjs'].includes(ext)) {
          stats.jsSize += size;
        } else if (['.css'].includes(ext)) {
          stats.cssSize += size;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'].includes(ext)) {
          stats.imageSize += size;
        } else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
          stats.fontSize += size;
        } else {
          stats.otherSize += size;
        }
      }
    });
  }
  
  analyzeDirectory(distPath);
  
  // Sort files by size (largest first)
  stats.files.sort((a, b) => b.size - a.size);
  
  // Display results
  console.log(colorize('\n📊 Bundle Analysis Results:', 'bright'));
  console.log('─'.repeat(50));
  
  console.log(`${colorize('Total Bundle Size:', 'bright')} ${formatBytes(stats.totalSize)}`);
  console.log(`${colorize('JavaScript:', 'yellow')} ${formatBytes(stats.jsSize)} (${((stats.jsSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`${colorize('CSS:', 'blue')} ${formatBytes(stats.cssSize)} (${((stats.cssSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`${colorize('Images:', 'green')} ${formatBytes(stats.imageSize)} (${((stats.imageSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`${colorize('Fonts:', 'magenta')} ${formatBytes(stats.fontSize)} (${((stats.fontSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`${colorize('Other:', 'cyan')} ${formatBytes(stats.otherSize)} (${((stats.otherSize / stats.totalSize) * 100).toFixed(1)}%)`);
  
  // Show largest files
  console.log(colorize('\n📁 Largest Files:', 'bright'));
  console.log('─'.repeat(50));
  
  stats.files.slice(0, 10).forEach((file, index) => {
    const sizeColor = file.size > 500000 ? 'red' : file.size > 100000 ? 'yellow' : 'green';
    console.log(`${index + 1}. ${file.path} - ${colorize(formatBytes(file.size), sizeColor)}`);
  });
  
  // Recommendations
  console.log(colorize('\n💡 Optimization Recommendations:', 'bright'));
  console.log('─'.repeat(50));
  
  if (stats.jsSize > 1000000) { // > 1MB
    console.log(colorize('⚠️  JavaScript bundle is large (>1MB). Consider code splitting.', 'yellow'));
  }
  
  if (stats.cssSize > 200000) { // > 200KB
    console.log(colorize('⚠️  CSS bundle is large (>200KB). Consider purging unused styles.', 'yellow'));
  }
  
  if (stats.imageSize > 2000000) { // > 2MB
    console.log(colorize('⚠️  Images are large (>2MB). Consider WebP/AVIF formats and compression.', 'yellow'));
  }
  
  const largeJSFiles = stats.files.filter(f => ['.js', '.mjs'].includes(f.ext) && f.size > 300000);
  if (largeJSFiles.length > 0) {
    console.log(colorize('⚠️  Large JavaScript files detected:', 'yellow'));
    largeJSFiles.forEach(file => {
      console.log(`   - ${file.path} (${formatBytes(file.size)})`);
    });
  }
  
  // Performance budget check
  console.log(colorize('\n🎯 Performance Budget Check:', 'bright'));
  console.log('─'.repeat(50));
  
  const budgets = {
    'Total Bundle': { current: stats.totalSize, budget: 2000000 }, // 2MB
    'JavaScript': { current: stats.jsSize, budget: 1000000 }, // 1MB
    'CSS': { current: stats.cssSize, budget: 200000 }, // 200KB
    'Images': { current: stats.imageSize, budget: 1000000 }, // 1MB
  };
  
  Object.entries(budgets).forEach(([name, { current, budget }]) => {
    const percentage = (current / budget) * 100;
    const status = percentage > 100 ? '❌' : percentage > 80 ? '⚠️' : '✅';
    const color = percentage > 100 ? 'red' : percentage > 80 ? 'yellow' : 'green';
    
    console.log(`${status} ${name}: ${colorize(formatBytes(current), color)} / ${formatBytes(budget)} (${percentage.toFixed(1)}%)`);
  });
  
  console.log(colorize('\n✨ Analysis Complete!', 'green'));
}

function generateBundleReport() {
  console.log(colorize('\n📋 Generating Detailed Bundle Report...', 'cyan'));
  
  try {
    // Run vite-bundle-analyzer if available
    execSync('npx vite-bundle-analyzer', { stdio: 'inherit' });
  } catch (error) {
    console.log(colorize('⚠️  vite-bundle-analyzer not available. Install with: npm install --save-dev vite-bundle-analyzer', 'yellow'));
  }
}

function checkDependencies() {
  console.log(colorize('\n📦 Checking Dependencies...', 'cyan'));
  
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const largeDependencies = [];
  
  // Check for commonly large dependencies
  const knownLargeDeps = {
    'moment': 'Consider using date-fns or dayjs instead',
    'lodash': 'Consider using lodash-es or individual functions',
    '@mui/material': 'Large UI library - ensure tree shaking is working',
    'antd': 'Large UI library - ensure tree shaking is working',
    'react-router-dom': 'Consider lazy loading routes',
  };
  
  Object.keys(dependencies).forEach(dep => {
    if (knownLargeDeps[dep]) {
      largeDependencies.push({ name: dep, suggestion: knownLargeDeps[dep] });
    }
  });
  
  if (largeDependencies.length > 0) {
    console.log(colorize('\n⚠️  Potentially Large Dependencies:', 'yellow'));
    largeDependencies.forEach(({ name, suggestion }) => {
      console.log(`   - ${name}: ${suggestion}`);
    });
  } else {
    console.log(colorize('✅ No known large dependencies detected.', 'green'));
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  console.log(colorize('🚀 Bundle Optimization Analysis', 'bright'));
  console.log(colorize('Modern Jewelry UI Performance Tool', 'cyan'));
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node analyze-bundle.js [options]

Options:
  --report, -r    Generate detailed bundle report
  --deps, -d      Check dependencies for optimization opportunities
  --help, -h      Show this help message

Examples:
  node analyze-bundle.js              # Basic analysis
  node analyze-bundle.js --report     # With detailed report
  node analyze-bundle.js --deps       # Check dependencies
    `);
    return;
  }
  
  analyzeBundleSize();
  
  if (args.includes('--deps') || args.includes('-d')) {
    checkDependencies();
  }
  
  if (args.includes('--report') || args.includes('-r')) {
    generateBundleReport();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  generateBundleReport,
  checkDependencies,
};