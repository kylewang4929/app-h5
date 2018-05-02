
import 'babel-polyfill';

import fs from 'fs';
import path from 'path';

import config from './src/config/template';

// @tintColor: #00c3ff;
// @topNavBackground: #fff;
// @topNavColor: #000;
// @bottomNavBackground: #fff;
// @bottomNavColor: #909090;
// @bottomNavActivationColor: #00c3ff;
// @activationColor: #00c3ff;
// @alertBackground: #fff;
// @alertColor: #909090;

const color = config.app.color;

let colorString = '';

for (let key in color) {
  colorString += '@' + key + ': ' + color[key] + ';';
}

fs.writeFile(path.join(__dirname, './src/color.less'), colorString, (err) => {
    if (err) throw err;
    console.log("Export Color Success!");
});
