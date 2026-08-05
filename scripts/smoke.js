const { spawn } = require('child_process');

const child = spawn(process.execPath, ['src/server.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: process.env.PORT || '5055' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
child.stdout.on('data', (chunk) => { output += chunk.toString(); });
child.stderr.on('data', (chunk) => { output += chunk.toString(); });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    await wait(5000);
    if (child.exitCode !== null) {
      console.error(output);
      throw new Error(`Server exited early with code ${child.exitCode}`);
    }

    const response = await fetch('http://localhost:5055/health');
    const body = await response.json();
    console.log(JSON.stringify({ status: response.status, body }, null, 2));

    if (![200, 503].includes(response.status)) {
      throw new Error(`Unexpected health status ${response.status}`);
    }
  } finally {
    child.kill('SIGTERM');
  }
})();
