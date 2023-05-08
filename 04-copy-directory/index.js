const fsPromises = require('fs/promises');
const path = require('path');

async function copyFile(file, dir, dirCopy) {
  try {
    await fsPromises.copyFile(
      path.join(__dirname, dir, file),
      path.join(__dirname, dirCopy, file)
    );
  } catch {
    console.log(`The file ${path.join(__dirname, dir, file)} could not be copied`);
  }
}

async function copyDir(dir, dirCopy) {
  await fsPromises.rm(`${path.join(__dirname, dirCopy)}`, { recursive: true, force: true });
  await fsPromises.mkdir(`${path.join(__dirname, dirCopy)}`, {recursive: true});
  for(let file of await fsPromises.readdir(`${path.join(__dirname, dir)}`, {withFileTypes: true})){
    if(file.isFile()){
      copyFile(file.name, dir, dirCopy);
    }  else if (file.isDirectory()) {
      let currDir = `${dir}\\${file.name}`;
      let currDirCopy = `${dirCopy}\\${file.name}`;
      copyDir(currDir, currDirCopy);
    }
  }
}

copyDir('files', 'files-copy');
