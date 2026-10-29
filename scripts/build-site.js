#!/usr/bin/env node
/**
 * build-site.js - Complete Website Build & Packaging for Shared Hosting
 * Runs core build, generates documentation pages, validates internal links,
 * and packages code/ into site-deploy.zip.
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('1. Running core build & asset compilation...');
execSync('node scripts/build.js', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('2. Validating website links & assets...');
execSync('node scripts/validate-mvp.js', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('3. Packaging website for shared hosting deployment...');
execSync('python scripts/package-site.py', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('\nWebsite build and shared hosting deployment package ready: site-deploy.zip');
