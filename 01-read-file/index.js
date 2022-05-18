const fs = require('fs');
const path = require('path');

let pathJoin = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(pathJoin, 'utf-8');
readableStream.on('data', (chunk) => console.log(chunk));
