const {execSync} = require('child_process');
const {writeFileSync} = require('fs');

const tsm = require('teamcity-service-messages');

// see https://docs.npmjs.com/cli/v8/commands/npm-audit#audit-level
const MIN_LEVEL = process.env.SEVERITY_LEVEL || 'high';

try {
  execSync(`npm audit --production --audit-level ${MIN_LEVEL}`);
  process.exit(0);
} catch (e) {
  writeFileSync(
    'npm-audit.html',
    `
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <pre>
${e.stdout.toString().replace(/.\[\d+m/g, '')}
  </pre>
</body>
</html>
`,
  );
}

try {
  execSync(`npm audit --production --audit-level ${MIN_LEVEL} --json`);
} catch (e) {
  const {advisories} = JSON.parse(e.stdout.toString());

  Object.values(advisories).forEach(({id, severity, overview, recommendation, references}) =>
    tsm.buildProblem({
      identity: id,
      description: `[${severity} severity] ${overview}.
${recommendation}
${references}`,
    }),
  );
}
