#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to the server's index.js
const serverPath = resolve(__dirname, '../build/index.js');

// Check if PLACID_API_TOKEN is provided
const apiToken = process.env.PLACID_API_TOKEN;
if (!apiToken) {
  console.error('Error: PLACID_API_TOKEN environment variable is required');
  console.error('Please set it before running the server:');
  console.error('export PLACID_API_TOKEN=your-token-here  # For Unix/Linux/MacOS');
  console.error('set PLACID_API_TOKEN=your-token-here     # For Windows CMD');
  console.error('$env:PLACID_API_TOKEN="your-token-here"  # For Windows PowerShell');
  process.exit(1);
}

// Start the server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
}); 