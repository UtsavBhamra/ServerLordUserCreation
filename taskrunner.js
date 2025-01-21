const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directory containing your JS files
const dirPath = path.join(__dirname, 'generated_tasks'); // Replace 'generated_tasks' with your folder name

// Read all files in the directory
fs.readdir(dirPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter for JavaScript files
    const jsFiles = files.filter(file => file.endsWith('.js'));

    // Execute each file
    jsFiles.forEach(file => {
        const filePath = path.join(dirPath, file);
        const process = exec(`node ${filePath}`);

        // Read fromm standard output stream of process
        process.stdout.on('data', data => {
            console.log(`[${file}]: ${data}`);
        });

        // Read from standard error stream of process
        process.stderr.on('data', data => {
            console.error(`[${file} ERROR]: ${data}`);
        });

        // Kill process after 10 secs if it is still running to avoid wastage of resources
        setTimeout(()=>{
            process.kill();
            console.log(`[${file}] process killed due to time out`);
        },10000); 
    });
});
