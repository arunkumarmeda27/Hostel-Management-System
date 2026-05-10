const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace indigo with blue for the main theme
    content = content.replace(/indigo/g, 'blue');

    // Specific replacements for Mess.jsx Veg/Non-Veg colors
    if (file.endsWith('Mess.jsx')) {
        content = content.replace(/'bg-emerald-100 text-emerald-800'/g, "'bg-blue-100 text-blue-800'");
        content = content.replace(/'bg-rose-100 text-rose-800'/g, "'bg-yellow-100 text-yellow-800'");
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated theme in ${path.basename(file)}`);
    }
});

console.log('Theme update complete!');
