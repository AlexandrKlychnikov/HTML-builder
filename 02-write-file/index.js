const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const file = path.join(__dirname, 'greeting.txt');

fs.writeFile(
  file,
  '',
  (err) => {
    if (err) throw err;
  });
process.on('exit', () => stdout.write('Вы бесподобны! Может Вам начать писать истории? До свидания!'));
process.on('SIGINT', () => process.exit());
stdout.write('Напишите что-нибудь\n');
let time = 0;
stdin.on('data', data => {
  if (data.toString().slice(0, data.toString().indexOf('\n') - 1) === 'exit') process.exit();
  const text = data.toString().slice(0, data.toString().indexOf('\n') - 1);
  fs.appendFile(
    file,
    `Ваш текст: "${text}"\n`,
    (err) => {
      if (err) throw err;
    }
  );
  time > 0 ? stdout.write('Ещё!\n') : stdout.write('Напишите еще что-нибудь\n');
  time++;
});