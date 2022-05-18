const fs = require('fs');
const path = require('path');

let pathJoin = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(pathJoin);

const { stdin, stdout } = process;

stdout.write('Hello! Write something...\n');

stdin.on('data', (data) => {
  data = data.toString();
  if (data.trim() !== 'exit') {
    output.write(data);
  } else {
    process.exit();
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Good bye!'));