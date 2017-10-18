// Copyright 2017-present JsOS project authors
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

var chalk = require('chalk');
var shell = require('shelljs');
var exec = require('../run/shell-exec');
var testCmd = require('../utils/testCmd');

module.exports = function (opts, cb) {
    var helper;
    if (process.platform === 'darwin') {
        // helper = require('./macos');
        return cb('MacOS isn\'t supported platform');
    } else if (process.platform === 'win32') {
        // helper = require('./windows');
        return cb('Windows isn\'t supported platform');
    } else if (process.platform === 'linux') {
        helper = require('./linux');
    } else {
        return cb('unknown/unsupported platform');
    }

    // testCmd('qemu-img', false);

    //   shell.echo(chalk.yellow('warning: it may appear that the process has frozen when creating large disk images'));
    shell.echo(chalk.yellow('Let\'s start to create the ISO image =)'));
    shell.echo(chalk.green(' --- creating image --- '));

    helper(opts, cb);
};