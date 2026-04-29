const fs = require('fs');
const mainCss = fs.readFileSync('src/styles.css', 'utf8');
const sosCss = fs.readFileSync('src/features/sos/styles.css', 'utf8');
const mapCss = fs.readFileSync('src/features/map/styles.css', 'utf8');

// The person1-reports branch CSS
const { execSync } = require('child_process');
const appCss = execSync('git show origin/person1-reports:src/App.css').toString('utf8');
const indexCss = execSync('git show origin/person1-reports:src/index.css').toString('utf8');

const combined = [mainCss, sosCss, mapCss, appCss, indexCss].join('\n\n/* --- NEW FILE --- */\n\n');

fs.writeFileSync('src/styles.css', combined, 'utf8');
console.log('Done!');
