const { spawn } = require('child_process');
const { kill } = require('cross-port-killer');

const env = Object.create(process.env);
env.BROWSER = 'none';
env.TEST = true;
const startServer = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['start'], {
  env,
});

startServer.stderr.on('data', data => {
  // eslint-disable-next-line
});

startServer.on('exit', () => {
  kill(process.env.PORT || 8000);
});

// eslint-disable-next-line
startServer.stdout.on('data', data => {
  // eslint-disable-next-line
  if (data.toString().indexOf('App running at') >= 0) {
    // eslint-disable-next-line
    const testCmd = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['test'], {
      stdio: 'inherit',
    });
    testCmd.on('exit', code => {
      startServer.kill();
      process.exit(code);
    });
  }
});
