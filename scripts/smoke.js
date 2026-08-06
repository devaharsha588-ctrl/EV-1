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
    console.log('Server output:\n', output);
    if (child.exitCode !== null) {
      console.error(output);
      throw new Error(`Server exited early with code ${child.exitCode}`);
    }

    const portMatch = output.match(/listening on port (\d+)/);
    const port = portMatch ? portMatch[1] : (process.env.PORT || '5000');
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();
    console.log(JSON.stringify({ status: response.status, body }, null, 2));

    if (![200, 503].includes(response.status)) {
      throw new Error(`Unexpected health status ${response.status}`);
    }
  } finally {
    child.kill('SIGTERM');
  }
})();
