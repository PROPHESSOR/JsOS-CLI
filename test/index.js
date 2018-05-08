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

const test = require('tape');
const path = require('path');
const runtimePack = require('../command/runtime-pack');
const runtimeStart = require('../command/runtime-start');

test('package ramdisk: ok', (t) => {
  runtimePack({
    "_": [path.resolve(__dirname, 'project-ok')]
  }, (err) => {
    t.ok(!err);
    t.end();
  })
});

test('package ramdisk: ok, list files', (t) => {
  runtimePack({
    "_": [path.resolve(__dirname, 'project-ok')],
    'list-files': true
  }, (err) => {
    t.ok(!err);
    t.end();
  })
});

test('package ramdisk: custom entry point', (t) => {
  runtimePack({
    "_": [path.resolve(__dirname, 'project-ok')],
    "entry": './custom'
  }, (err) => {
    t.ok(!err);
    t.end();
  })
});

test('package ramdisk: no runtime js', (t) => {
  runtimePack({
    "_": [path.resolve(__dirname, 'project-no-runtimejs')]
  }, (err) => {
    t.equal(err, 'directory does not contain runtime.js library, please run "npm install runtimejs"');
    t.end();
  })
});

test('package ramdisk: multiple runtime js copies', (t) => {
  runtimePack({
    "_": [path.resolve(__dirname, 'project-multiple-runtimejs')]
  }, (err) => {
    t.ok(err.indexOf('found two copies of the runtime.js library') === 0);
    t.end();
  })
});

test('start', (t) => {
  const cwd = process.cwd;
  process.cwd = function() {
    return path.resolve(__dirname, 'project-ok');
  };
  runtimeStart({
    "_": [path.resolve(__dirname, 'project-ok')],
    "verbose": true,
    'dry-run': true
  }, (err) => {
    t.ok(!err);
    process.cwd = cwd;
    t.end();
  })
});

test('runtime command', (t) => {
  require('../bin/runtime');
  t.end();
});
