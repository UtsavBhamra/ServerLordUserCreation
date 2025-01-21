const fs = require('fs');
const path = require('path');

// URL reading function
const urls = fs.readFileSync('pingURLs.txt', 'utf8')
    .split('\n')
    .filter(url => url.trim())
    .map(url => url.trim());

// generated tasks directory creation
const outputDir = 'generated_tasks';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Template for the JS file content
const generateJsContent = (url) => `
import fetch from "node-fetch";

async function sendHeartbeat() {
    try {
        const response = await fetch('${url}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data = await response.json();
        console.log(\`Heartbeat sent successfully to ${url}\`);
        console.log('Response:', data);
    } catch (error) {
        console.error('error:', error);
    }
}

sendHeartbeat();
`;

// Generating task for each url
urls.forEach((url, index) => {
    const taskId = url.match(/tasks\/(\d+)/)[1];
    const filename = path.join(outputDir, `task${taskId}_heartbeat.js`);

    fs.writeFileSync(filename, generateJsContent(url));
    console.log(`Generated ${filename}`);
});

console.log('\nAll task files have been generated!');
console.log(`Check the '${outputDir}' directory for the generated files.`);
