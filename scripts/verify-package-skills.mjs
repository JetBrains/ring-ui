import {execFileSync} from 'node:child_process';

const requiredSkillFiles = [
  'skills/ring-ui/SKILL.md',
  'skills/ring-ui/references/forms-and-feedback.md',
  'skills/ring-ui/references/page-layouts.md',
];

const output = execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
  cwd: process.cwd(),
  encoding: 'utf8',
});
const jsonStart = output.search(/^\[\r?$/m);

if (jsonStart === -1) {
  throw new Error('npm pack output does not contain a top-level JSON array');
}

const [packResult] = JSON.parse(output.slice(jsonStart));
const packedFiles = new Set(packResult.files.map(file => file.path));
const missingFiles = requiredSkillFiles.filter(file => !packedFiles.has(file));

if (missingFiles.length > 0) {
  throw new Error(`npm package is missing Ring UI Skill files:\n${missingFiles.join('\n')}`);
}

process.stdout.write(`Verified ${requiredSkillFiles.length} Ring UI Skill files in ${packResult.filename}\n`);
