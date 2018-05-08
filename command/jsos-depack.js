// Copyright 2017-present runtime.js project authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');
const chalk = require('chalk');
const exec = require('../run/shell-exec');


module.exports = function (opts) {
  const filename = opts._[0];
  if (process.platform === 'darwin') {
    return console.log(chalk.red("Mac OS doesn't supported!"));
  } else if (process.platform === 'win32') {
    return console.log(chalk.red("Windows doesn't supported!"))
  } else if (process.platform === 'linux') { //FIXME: It doesn't works! Output file is broken
    exec(`{ printf "\x1f\x8b\x08\x00\x00\x00\x00\x00"; tail -c +25 ${filename}; } > ${filename}.gz`, (e) => console.log(e?chalk.red(e):chalk.green("OK!!!")));
  } else {
    return console.log(chalk.red('unknown/unsupported platform'));
  }
};
