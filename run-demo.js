#!/usr/bin/env node

/**
 * Simple Node.js script to run the Soil-to-Shelf Traceability System demo
 * This script can be run directly with: node run-demo.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting Soil-to-Shelf Traceability System Demo...\n');

try {
  // Change to the project directory
  process.chdir(__dirname);
  
  // Install dependencies if needed
  console.log('📦 Checking dependencies...');
  try {
    require('./package.json');
    console.log('✅ Package.json found');
  } catch (error) {
    console.log('❌ Package.json not found, please run from project root');
    process.exit(1);
  }

  // Check if node_modules exists
  const fs = require('fs');
  if (!fs.existsSync('./node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  } else {
    console.log('✅ Dependencies already installed');
  }

  // Run the TypeScript demo
  console.log('\n🚀 Running demo application...\n');
  console.log('=' .repeat(60));
  
  execSync('npx ts-node demo-app.ts', { stdio: 'inherit' });
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Demo completed successfully!');
  
} catch (error) {
  console.error('\n❌ Demo failed:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('   1. Make sure you have Node.js installed');
  console.error('   2. Run "npm install" to install dependencies');
  console.error('   3. Make sure TypeScript is available (npm install -g typescript)');
  console.error('   4. Try running "npx ts-node demo-app.ts" directly');
  process.exit(1);
}