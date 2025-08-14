const { spawn } = require('child_process');
const path = require('path');

// Start Express server
const expressServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

console.log('Started Express server on http://localhost:4000');

// Start Next.js app
const nextApp = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('Started Next.js app on http://localhost:3000');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  expressServer.kill();
  nextApp.kill();
  process.exit(0);
});

// Log any errors
expressServer.on('error', (error) => {
  console.error('Express server error:', error);
});

nextApp.on('error', (error) => {
  console.error('Next.js app error:', error);
});

// Handle process exit
expressServer.on('close', (code) => {
  console.log(`Express server exited with code ${code}`);
});

nextApp.on('close', (code) => {
  console.log(`Next.js app exited with code ${code}`);
});