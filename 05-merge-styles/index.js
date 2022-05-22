const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'styles');
const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToBundleFile = path.join(pathToDistFolder, 'bundle.css');

async function bundle() {
  try {
    const styleFiles = await readdir(pathToFolder, { withFileTypes: true });
    const arrStyles = [];

    for (let file of styleFiles) {
      let { name } = file;
      let fileExtension = name.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];

      if (file.isFile() && fileExtension === 'css') {
        const input = fs.createReadStream(
          path.join(pathToFolder, name),
          'utf-8'
        );
        input.on('data', (chunk) => arrStyles.push(chunk));
        const output = fs.createWriteStream(pathToBundleFile);
        input.on('end', () => output.write(arrStyles.join('\n\n')));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

bundle();
