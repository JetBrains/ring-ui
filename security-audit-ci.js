const {execSync} = require('child_process');
const {writeFileSync} = require('fs');

const tsm = require('teamcity-service-messages');

// see https://classic.yarnpkg.com/en/docs/cli/audit/
const MIN_LEVEL = process.env.SEVERITY_LEVEL || 'moderate';

try {
  execSync(`yarn audit --level ${MIN_LEVEL}`);
  process.exit(0);
} catch (e) {
  writeFileSync(
    'yarn-audit.html',
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
  execSync('yarn audit --json');
} catch (e) {
  e.stdout.
    toString().
    split(/\n/g).
    filter(Boolean).
    map(line => JSON.parse(line)).
    filter(({type}) => type === 'auditAdvisory').
    forEach(({data}) => {
      const {
        id,
        severity,
        overview,
        recommendation,
        references
      } = data.advisory;
      tsm.buildProblem({
        identity: id,
        description: `[${severity} severity] ${overview}.
${recommendation}
${references}`
      });
    });
}
