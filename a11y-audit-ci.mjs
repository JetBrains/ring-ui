import {exec, execSync} from 'node:child_process'

const server = exec('npm run serve');
let isFailure = false;
try {
  execSync(`npm run a11y-audit`, {
    stdio: 'inherit',
  })
} catch (e) {
  isFailure = true
}
server.kill();
// eslint-disable-next-line no-process-exit
process.exit(isFailure ? 1 : 0);
