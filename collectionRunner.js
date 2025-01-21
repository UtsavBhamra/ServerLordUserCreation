const newman = require('newman'); // require newman in your project
const fs = require('fs');

// Open the file for appending the pingURL
const outputFile = 'pingURLs.txt';

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./server-lord-api.postman_collection.json'),
    reporters: 'cli'
})
.on('beforeRequest', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
})
.on('request', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    // Extract the response body and parse it
    const res = data.response.stream.toString();
    try {
        const jsonResponse = JSON.parse(res);

        // Extract the pingURL for each task
        const pingURL = jsonResponse.pingURL;

        // Append the pingURL to the file
        if (pingURL) {
            fs.appendFile(outputFile, pingURL + '\n', (err) => {
                if (err) {
                    console.log('Error writing pingURL to file:', err);
                } else {
                    console.log(`pingURL for task ${jsonResponse.name} appended to file`);
                }
            });
        }
    } catch (error) {
        console.log('Error parsing response:', error);
    }
});
