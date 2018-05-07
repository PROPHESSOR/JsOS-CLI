// Copyright 2018 JsOS project authors
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

const chalk = require('chalk');

const exec = require('../run/shell-exec');
const testCmd = require('../utils/testCmd');

module.exports = (opts, cb) => {
  const { filename } = opts;
  testCmd('dd', true);
  testCmd('parted', true);

  console.log(chalk.cyan('Preparing to create an image...'));
  exec(`dd if=/dev/zero of=${filename} bs=1M count=32`)
    .then(() => exec(`parted -s ${filename} mklabel msdos`))
    .then(() => exec(`parted -s ${filename} mkpart P1 fat32 0 100%`))
    .then(() => {
      console.info(chalk.green('The image was created successfully!'))
    })
    .catch((code, error) => {
      console.error(chalk.red(`An error occurred while creating the image: [${code || '?'}] ${error || ''}`))
      return cb();
    });
}
