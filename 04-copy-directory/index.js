const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function copyFiles() {
  try {
    await rm(copyFolderPath, { recursive: true, force: true });
    await mkdir(copyFolderPath, { recursive: true });

    let files = await readdir(folderPath, { withFileTypes: true });

    for (let file of files) {
      let pathToFile = path.join(folderPath, file.name);
      let pathToCopyFile = path.join(copyFolderPath, file.name);

      if (!file.isDirectory()) {
        await copyFile(pathToFile, pathToCopyFile);
      } else {
        copyFiles(pathToFile, pathToCopyFile);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyFiles();
