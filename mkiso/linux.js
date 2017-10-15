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

const exec = require('../run/shell-exec');
const testCmd = require('../utils/testCmd');
const fs = require('fs');

module.exports = function(opts, cb) {
//   testCmd('losetup', true);
//   testCmd('mkfs.msdos', false);
    testCmd('grub-mkrescue', false);


    if(fs.existsSync(opts.filename)){
        exec(`grub.mkrescue -o ${opts.filename}`, function(code, out){
            cb();
        });
    }else{
        cb("Folder doesn't exist!");
        //TODO: Creating the folder
    }
//   exec('losetup -f', function(code, output) {
//     var mountpoint = output.trim();
//     exec('losetup ' + mountpoint + ' ' + opts.filename, function(code, output) {
//       exec('mkfs.msdos -F 32 -n "' + opts.label + '" ' + mountpoint, function(code, output) {
//         exec('losetup -d ' + mountpoint, function(code, output) {
//           cb();
//         });
//       });
//     });
//   });
};
