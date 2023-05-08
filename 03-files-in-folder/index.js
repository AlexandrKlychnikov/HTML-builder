const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function readDir(){
  const secretFolder = path.join(__dirname, 'secret-folder');
  for(let file of await fsPromises.readdir(path.join(__dirname, 'secret-folder') , {withFileTypes: true})){
    if(file.isFile()){
      fs.stat(path.join(secretFolder, file.name), (error, stats) => {
        if (error) {
          console.log(error);
        }
        else {
          const fileName = path.basename(`${file.name}`, `${path.extname(`${file.name}`)}`);
          const fileExt = path.extname(`${file.name}`).slice(1);
          console.log(`${fileName} - ${fileExt} - ${Math.round((stats.size / 1024)*1000)/1000}kb`);
        }
      });
    }
  }
}

readDir();