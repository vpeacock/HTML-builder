const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

let pathJoin = path.join(__dirname, 'secret-folder');

async function getInfo(pathFolder) {
  try {
    const files = await readdir(pathFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let pathFile = path.join(pathFolder, file.name);
        fs.stat(pathFile, (error, stat) => {
          if (error) {
            console.log(error.message);
          } else {
            let fileParseInfo = path.parse(pathFile);
            let fileInfo = `${fileParseInfo.name} - ${fileParseInfo.ext.slice(
              1
            )} - ${stat.size / 1024}kb`;
            console.log(fileInfo);
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getInfo(pathJoin);
