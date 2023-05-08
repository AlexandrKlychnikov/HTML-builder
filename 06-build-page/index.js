const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'project-dist');
fsPromises.mkdir(`${dir}`, {recursive: true});
const bundle = path.join(__dirname, 'project-dist', 'style.css');
fs.writeFile(
  bundle,
  '',
  (err) => {
    if (err) throw err;
  });

async function bundleThis(){
  let styleArr = [];
  for(let file of await fsPromises.readdir(`${path.join(__dirname, 'styles')}`, {withFileTypes: true})){
    let fileExt = path.extname(`${file.name}`).slice(1);
    if(file.isFile() && fileExt === 'css'){
      styleArr.push(file.name);
    }
  }
  styleArr.reverse();
  for await (let file of styleArr) {
    const stream = fs.createReadStream(`${path.join(__dirname, 'styles', file)}`, 'utf-8');
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

bundleThis();

async function replaceTag() {
  const re = /{{.*}}/g;
  const tagsArr = [];
  let html;
  const inFile = path.join(__dirname, 'template.html');
  const input = (await fsPromises.readFile(inFile)).toString();
  html = input;
  for (const match of html.match(re)) {
    tagsArr.push(match);
  }
  for await (let tag of tagsArr) {
    const tagName = tag.slice(2, tag.indexOf('}}'));
    const component = await fsPromises.readFile(
      path.join(__dirname,
        'components',
        `${tagName}.html`
      ));
    const tagRep = new RegExp(`{{${tagName}}}`);
    html = html.replace(tagRep, component);
  }
  return html;
}

replaceTag().then(res => {
  const dir = path.join(__dirname, 'project-dist');
  fs.writeFile(
    path.join(dir, 'index.html'),
    res,
    (err) => {
      if (err) throw err;
    });
});

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

copyDir('assets', 'project-dist\\assets');
