const { execSync } = require('child_process');
const issues = JSON.parse(execSync('gh issue list --state open --limit 50 --json number,title', { encoding: 'utf-8' }));

// First, fetch existing labels
let existingLabels = [];
try {
  const labelsOutput = execSync('gh label list --json name', { encoding: 'utf-8' });
  existingLabels = JSON.parse(labelsOutput).map(l => l.name.toLowerCase());
} catch (e) {
  console.log("Could not fetch existing labels.");
}

function ensureLabel(name, color="ededed") {
  if (!existingLabels.includes(name.toLowerCase())) {
    console.log(`Creating label: ${name}`);
    try {
      execSync(`gh label create "${name}" -c "${color}"`);
      existingLabels.push(name.toLowerCase());
    } catch(e) {
      console.error(`Failed to create label ${name}`);
    }
  }
}

// Ensure priority labels exist
ensureLabel('priority: critical', 'b60205');
ensureLabel('priority: high', 'd93f0b');
ensureLabel('priority: medium', 'fbca04');
ensureLabel('good-first-issue', '7057ff');

for (const issue of issues) {
  const match = issue.title.match(/\[(.*?)\]/);
  if (match) {
    let label = match[1].toLowerCase().trim();
    ensureLabel(label, '5319e7');
    
    let labels = [label];
    
    if ([1, 2, 12, 13, 11].includes(issue.number) || issue.title.includes('gitignore') || issue.title.includes('tsconfig') || issue.title.includes('Missing Core') || issue.title.includes('postcss')) {
      labels.push('good-first-issue');
    }
    
    if (issue.title.includes('Security') || issue.title.includes('gitignore') || issue.title.includes('tsconfig')) {
      labels.push('priority: critical');
    } else if (issue.title.includes('API') || issue.title.includes('Middleware') || issue.title.includes('Error Boundaries') || issue.title.includes('Docker')) {
      labels.push('priority: high');
    } else if (issue.title.includes('Logging') || issue.title.includes('WCAG')) {
      labels.push('priority: medium');
    }

    const labelsStr = labels.map(l => `"${l}"`).join(',');
    
    console.log(`Tagging Issue #${issue.number} with: ${labelsStr}`);
    try {
      execSync(`gh issue edit ${issue.number} --add-label ${labelsStr}`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed to tag issue ${issue.number}`);
    }
  }
}
console.log("Done!");
