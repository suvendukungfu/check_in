const { spawn } = require('child_process');

console.log('Starting Event Check-in System...');
console.log('Express Server: http://localhost:4000');
console.log('Next.js App: http://localhost:3000');
console.log('Press Ctrl+C to stop both servers\n');

// Start Express server
const expressServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '4000' }
});

// Start Next.js development server
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  expressServer.kill('SIGINT');
  nextServer.kill('SIGINT');
  process.exit(0);
});

// Handle server exits
expressServer.on('exit', (code) => {
  console.log(`Express server exited with code ${code}`);
  if (code !== 0) {
    nextServer.kill('SIGINT');
    process.exit(1);
  }
});

nextServer.on('exit', (code) => {
  console.log(`Next.js server exited with code ${code}`);
  if (code !== 0) {
    expressServer.kill('SIGINT');
    process.exit(1);
  }
});