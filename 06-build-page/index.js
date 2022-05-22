const path = require('path');
const {
  rm,
  mkdir,
  readdir,
  copyFile,
  readFile,
  writeFile,
} = require('fs/promises');
const fs = require('fs');

const pathProjectDist = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');
const pathAssets = path.join(__dirname, 'assets');
const pathStyles = path.join(__dirname, 'styles');
const pathTemplateHtml = path.join(__dirname, 'template.html');

fs.access(pathProjectDist, async (error) => {
  if (error) {
    await mkdir(pathProjectDist);
    buildPage();
  } else {
    await rm(pathProjectDist, { recursive: true, force: true });
    await mkdir(pathProjectDist, { recursive: true });
    buildPage();
  }
});

async function createHtmlMarkup() {
  try {
    let templateHtmlFile = await readFile(pathTemplateHtml);
    templateHtmlFile = templateHtmlFile.toString();

    const htmlComponents = await readdir(pathComponents, {
      withFileTypes: true,
    });

    for (let component of htmlComponents) {
      let componentHtmlFile = await readFile(
        path.join(pathComponents, component.name)
      );
      let componentName = path.basename(
        path.join(pathComponents, component.name),
        '.html'
      );
      templateHtmlFile = templateHtmlFile.replace(
        `    {{${componentName}}}`,
        componentHtmlFile.toString()
      );
    }

    writeFile(path.join(pathProjectDist, 'index.html'), templateHtmlFile);
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFiles(folderPath, copyFolderPath) {
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

async function bundle(pathToFolder, pathToBundleFile) {
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

function buildPage() {
  createHtmlMarkup();
  bundle(pathStyles, path.join(pathProjectDist, 'style.css'));
  copyFiles(pathAssets, path.join(pathProjectDist, 'assets'));
}
