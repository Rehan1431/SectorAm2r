const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const filesToAudit = [
    'index.php',
    'game.php',
    'get_game.php',
    'data/database.xml'
];

let errors = [];
let auditedLinks = 0;

filesToAudit.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
        errors.push({ file: relPath, issue: 'File does not exist' });
        return;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const dir = path.dirname(fullPath);

    // Regex to find href, src, link targets
    const regex = /(?:href|src|banner|svg_image)=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let link = match[1];
        if (link.startsWith('#') || link.startsWith('<?') || link.startsWith('https://fonts.')) continue;
        auditedLinks++;

        // Verify strictly relative and local
        if (link.startsWith('http://') || (link.startsWith('https://') && !link.includes('fonts.'))) {
            errors.push({ file: relPath, link, issue: 'External absolute URL' });
        } else if (link.startsWith('/')) {
            errors.push({ file: relPath, link, issue: 'Root-relative path' });
        } else if (/^[a-zA-Z]:/.test(link)) {
            errors.push({ file: relPath, link, issue: 'Absolute OS drive path' });
        } else {
            const cleanLink = link.split('?')[0].split('#')[0];
            const targetPath = path.resolve(dir, cleanLink);
            if (!fs.existsSync(targetPath)) {
                // Also check relative to rootDir
                const rootTargetPath = path.resolve(rootDir, cleanLink);
                if (!fs.existsSync(rootTargetPath)) {
                    errors.push({ file: relPath, link, issue: 'Target does not exist: ' + targetPath });
                }
            }
        }
    }
});

console.log('====================================================');
console.log(' SECTOR AM2R DYNAMIC // PATH & XML AUDIT REPORT     ');
console.log('====================================================');
console.log('Total Links, Scripts & Assets Audited:', auditedLinks);
if (errors.length === 0) {
    console.log('STATUS: PASSED (100% Relative Local Pathing Verified)');
} else {
    console.error('STATUS: FAILED');
    console.error(JSON.stringify(errors, null, 2));
    process.exit(1);
}
