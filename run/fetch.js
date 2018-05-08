// Copyright 2015-present runtime.js project authors
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

const request = require('request');
const gunzip = require('gunzip-maybe');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const progressStream = require('progress-stream');
const log = require('single-line-log').stdout;
const prettyBytes = require('pretty-bytes');

module.exports = function(kernelVersion, shouldBeLocal, cb) {
  const basePath = shouldBeLocal ? __dirname : process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  const kernelsDir = path.resolve(basePath, '.jsos-kernel');
  if (!shell.test('-d', kernelsDir)) {
    shell.mkdir(kernelsDir);
  }

  const tmpName = `jsos.${kernelVersion}.download`;
  const tmpFile = path.resolve(kernelsDir, tmpName);
  const resultFile = path.resolve(kernelsDir, `jsos.${kernelVersion}`);

  if (shell.test('-f', resultFile)) {
    return cb(null, resultFile);
  }

  if (shell.test('-f', tmpFile)) {
    shell.rm('-f', tmpFile);
  }

  const displayName = `runtime.gz.${kernelVersion}`;
  const url = `https://github.com/JsOS-Team/jsos-kernel-builds/raw/master/runtime.gz.${kernelVersion}`;

  /*// Newer versions are stored as GitHub releases
  if (kernelVersion > 3) {
    var tag = ((kernelVersion >>> 20) & 0x3ff) + '.' + ((kernelVersion >>> 10) & 0x3ff) + '.' + (kernelVersion & 0x3ff);
    displayName = 'release v' + tag;
    url = 'https://github.com/runtimejs/runtime/releases/download/v' + tag + '/runtime.gz';
  }*/

  const req = request(url);

  req.on('response', (res) => {
    if (res.statusCode !== 200) {
      return cb(`jsos kernel "${url}" download error (http ${res.statusCode})`);
    }

    const totalLength = Number(res.headers['content-length']);

    let stream = res;

    if (totalLength) {
      const progress = progressStream({
        "length": totalLength
      });

      progress.on('progress', (p) => {
        const value = p.percentage | 0;

        if (value <= 0) {
          return;
        }

        if (value === 100) {
          log('');
          return;
        }

        const left = (value / 2) | 0;
        const right = 50 - left;

        const progressBar = `[${Array(left + 1).join('=')}>${Array(right).join(' ')}]`;
        log(`Downloading ${displayName}...\n${progressBar} ${value}% of ${prettyBytes(totalLength)}`);
      });

      stream = stream.pipe(progress);
    }

    log(`Downloading ${displayName}...`);

    function complete(err) {
      if (err) {
        return cb(err);
      }

      shell.mv('-f', tmpFile, resultFile);
      cb(null, resultFile);
    }

    const out = fs.createWriteStream(tmpFile, { "flags": 'w', "defaultEncoding": 'binary' });
    out.on('error', complete);
    out.on('finish', complete);

    stream.pipe(gunzip()).pipe(out);
  });
};
