const fs = require('fs');
const path = require('path');
const https = require('https');

const BIN_DIR = path.join(__dirname, '..', 'bin');
const NODE_EXE_PATH = path.join(BIN_DIR, 'node.exe');
const NODE_URL = 'https://nodejs.org/dist/v20.11.0/win-x64/node.exe';

function downloadFile(url, destPath) {
    if (!fs.existsSync(BIN_DIR)) {
        fs.mkdirSync(BIN_DIR, { recursive: true });
    }

    if (fs.existsSync(destPath)) {
        console.log(`node.exe already exists at ${destPath}, skipping download.`);
        return Promise.resolve();
    }

    console.log(`Downloading node.exe from ${url}...`);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download node.exe. Status code: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('Download complete.');
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

downloadFile(NODE_URL, NODE_EXE_PATH)
    .catch((err) => {
        console.error('Error downloading node.exe:', err);
        process.exit(1);
    });
