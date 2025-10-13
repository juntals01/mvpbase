// Usage: npm run mg -- CreateUsersTable
const { spawnSync } = require('child_process');
const name = process.argv[2];
if (!name) {
  console.error('❌ Provide a migration name, e.g. CreateUsersTable');
  process.exit(1);
}
const path = `src/database/migrations/${name}`;
spawnSync(
  'node',
  [
    '-r',
    'ts-node/register',
    '-r',
    'tsconfig-paths/register',
    './node_modules/typeorm/cli.js',
    '-d',
    'src/database/data-source.ts',
    'migration:generate',
    path,
  ],
  { stdio: 'inherit' },
);
