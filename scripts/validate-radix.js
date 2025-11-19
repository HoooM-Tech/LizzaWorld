const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const sections = ['dependencies', 'devDependencies'];
const invalidEntries = [];

const isValidSemver = (value) => /^\d+\.\d+\.\d+(?:[-+].+)?$/.test(value);

for (const section of sections) {
  const deps = pkg[section];
  if (!deps) continue;

  for (const [name, version] of Object.entries(deps)) {
    if (!name.startsWith('@radix-ui/')) continue;

    if (typeof version !== 'string' || !isValidSemver(version.trim())) {
      invalidEntries.push({ section, name, version });
    }
  }
}

if (invalidEntries.length > 0) {
  console.error('Found invalid @radix-ui/* dependency versions in package.json:');
  for (const entry of invalidEntries) {
    console.error(`- ${entry.name} (${entry.section}): ${entry.version || 'undefined'}`);
  }
  console.error('\nPlease update the listed entries to valid published versions.');
  process.exitCode = 1;
} else {
  const found = sections.flatMap((section) => {
    const deps = pkg[section];
    if (!deps) return [];
    return Object.keys(deps).filter((name) => name.startsWith('@radix-ui/')).map((name) => ({
      section,
      name,
      version: deps[name],
    }));
  });

  if (found.length === 0) {
    console.log('No @radix-ui/* dependencies found in package.json.');
  } else {
    console.log('All @radix-ui/* dependencies have valid versions:');
    for (const dep of found) {
      console.log(`- ${dep.name} (${dep.section}): ${dep.version}`);
    }
  }
}
