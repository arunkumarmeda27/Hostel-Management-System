const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

console.log(`${colors.green}Starting Hostel Management System...${colors.reset}\n`);

// Helper to spawn processes and format their output
const runProcess = (name, command, args, cwd, color) => {
  const proc = spawn(command, args, { cwd, shell: true });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      console.log(`${color}[${name}]${colors.reset} ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      console.error(`${colors.red}[${name} ERROR]${colors.reset} ${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${color}[${name}]${colors.reset} exited with code ${code}`);
  });

  return proc;
};

// Start Backend
const backend = runProcess(
  'BACKEND',
  'npm',
  ['start'],
  path.join(__dirname, 'backend'),
  colors.blue
);

// Start Frontend
const frontend = runProcess(
  'FRONTEND',
  'npm',
  ['run', 'dev'],
  path.join(__dirname, 'frontend'),
  colors.magenta
);

// Wait a few seconds for Vite to start, then start ngrok
console.log(`${colors.green}Waiting for services to boot before starting ngrok...${colors.reset}`);
setTimeout(() => {
  const ngrok = runProcess(
    'NGROK',
    'npx',
    ['ngrok', 'http', '5173'],
    path.join(__dirname, 'frontend'),
    colors.green
  );

  console.log(`\n${colors.green}=========================================${colors.reset}`);
  console.log(`${colors.green}System is running!${colors.reset}`);
  console.log(`${colors.green}Look for the 'Forwarding' URL in the NGROK output above to access your site publicly.${colors.reset}`);
  console.log(`${colors.green}=========================================\n${colors.reset}`);
}, 5000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.red}Shutting down services...${colors.reset}`);
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});
