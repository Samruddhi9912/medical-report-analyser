const fs = require('fs');
const path = require('path');

const dir = __dirname;
let medicalData = fs.readFileSync(path.join(dir, 'medicalData.js'), 'utf8');
let validator = fs.readFileSync(path.join(dir, 'validator.js'), 'utf8');
let translations = fs.readFileSync(path.join(dir, 'translations.js'), 'utf8');
let app = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// Strip exports
medicalData = medicalData.replace(/export const /g, 'const ');
validator = validator.replace(/export const /g, 'const ').replace(/export function /g, 'function ');
translations = translations.replace(/export const /g, 'const ');

// Strip imports from app.js
app = app.replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?/g, '');

const bundle = `// ClariMed Standalone Single Bundle - Works both on file:// and http://
(function() {
${medicalData}

${validator}

${translations}

${app}
})();
`;

fs.writeFileSync(path.join(dir, 'bundle.js'), bundle, 'utf8');
console.log('Successfully created bundle.js! Size:', bundle.length, 'bytes');
