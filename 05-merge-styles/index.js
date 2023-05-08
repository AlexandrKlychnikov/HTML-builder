const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
fs.writeFile(
  bundle,
  '',
  (err) => {
    if (err) throw err;
  });

async function bundleThis(){
  for(let file of await fsPromises.readdir(path.join(__dirname, 'styles') , {withFileTypes: true})){
    let fileExt = path.extname(`${file.name}`).slice(1);
    if(file.isFile() && fileExt === 'css') {
      const stream = fs.createReadStream(`${path.join(__dirname, 'styles', file.name)}`, 'utf-8');
      stream.on('data', (data) => {
        fs.appendFile(
          bundle,
          `${data}\n`,
          (err) => {
            if (err) throw err;
          }
        );
      });
    }
  }

}

bundleThis();