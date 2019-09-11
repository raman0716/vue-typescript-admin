/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const root = path.resolve(__dirname, '../');
const file = `${root}/version.json`;

try {
  const data = fs.readFileSync(file);
  const { version } = JSON.parse(data);

  let [a, b, c] = version.split('.'); // length is 3
  a = a.padStart(2, '0');
  b = b.padStart(2, '0');
  c = c.padStart(2, '0');

  const num = +(a + b + c) + 1;
  const strTmp = String(num);
  const end = strTmp.slice(-2);
  const mid = strTmp.slice(-4, -2).padStart(2, '0');
  const start = strTmp.slice(-10, -4).padStart(10, '0');

  const res = `${+start}.${+mid}.${+end}`;

  fs.writeFileSync(
    file,
    `{\n"warning":"merge的时候保留版本号较大的",\n"version": "${res}"\n}`
  );
} catch (e) {
  console.log(e);
}
