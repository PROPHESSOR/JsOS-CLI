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
const chalk = require('chalk');

module.exports = function(opts, cb) {
//   testCmd('losetup', true);
//   testCmd('mkfs.msdos', false);
    testCmd('grub-mkrescue', false);


    if(fs.existsSync(opts.filename)){
        exec(`grub.mkrescue -o ${opts.filename} ${opts.foldername}`, function(code, out){
            cb();
        });
    }else{
        exec(`mkdir ${opts.foldername}`, function(e,){
            if(e) return cb(e);

            if(!opts.kernel) return cb("Folder doesnt not exists and kernel wasn't specified");
            if(!opts.initrd) return cb("Folder doesnt not exists and kernel wasn't specified");

            exec(`cp ${opts.kernel} ${opts.foldername}/kernel`,function(e,r){
                if(e) return cb(e);

                exec(`cp ${opts.initrd} ${opts.foldername}/initrd`,function(e,r){
                    exec(`mkdir ${opts.foldername}/grub/`,function(e,r){
                        const grubcfg = 'set timeout=0\nset default=0\nmenuentry "JsOS" {\n\tmultiboot /kernel\n\tmodule /initrd\n\tboot\n}"';
                        fs.writeFile(`${opts.foldername}/grub/grub.cfg`, grubcfg, function(e){
                            if(e) return cb(e);

                            console.log(chalk.green(`The folder ${opts.foldername} was created successful!\n You should run the "jsos mkiso filename.iso ${opts.foldername}" to build the image ;)`));
                            return cb();
                        });
                    });
                })
            })
        })
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
