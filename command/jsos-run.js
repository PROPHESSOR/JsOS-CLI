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

const qemu = require('../run/qemu');
const getRuntime = require('../run/get-runtime');
const readInitrd = require('../pack/read-initrd');

module.exports = function (args, cb) {
  if (args._.length === 0) {
    return cb('no ramdisk bundle specified');
  }

  // fix QEMU stdout on Windows
  process.env.SDL_STDIO_REDIRECT = 'no';

  let kernelFile = String(args.kernel || '');
  const initrdFile = String(args._[0] || global.ROOT_DIRECTORY || '');

  const fileData = readInitrd(initrdFile);
  if (!fileData) {
    return cb('ramdisk bundle read error');
  }

  const qemuNet = args.net;
  const qemuNetdev = args.netdev;

  let extraPorts = [];
  if (typeof args.port === 'number') {
    extraPorts = [args.port];
  }
  if (args.port instanceof Array) {
    extraPorts = args.port;
  }

  const qemuNetdump = !!args.netdump;
  const qemuCurses = !!args.curses;
  const qemuKVM = !!args.kvm;
  const qemuUSB = !!args.usb;
  const qemuPCSpk = !!args.pcspk;
  const qemuAppend = args.append || '';
  const qemuNographic = !!args.nographic;
  const qemuVirtioRng = !!args['virtio-rng'];
  const qemuCommandAppend = args['append-qemu'] || '';

  const dryRun = !!args['dry-run'];
  const verbose = !!args.verbose;

  const { hd0, hd0img } = args;

  let drives = [];
  if (typeof args.drive === 'string') {
    drives = [args.drive];
  }
  if (Array.isArray(args.drive)) {
    drives = args.drive;
  }

  getRuntime(fileData.kernelVer, kernelFile, !!args.local, (err, runtimeFile) => {
    if (err) {
      return cb(err)
    }

    kernelFile = runtimeFile;

    qemu({
      hd0,
      hd0img,
      verbose,
      "initrd": initrdFile,
      "kernel": kernelFile,
      "net": qemuNet,
      "netdev": qemuNetdev,
      "netdump": qemuNetdump,
      "curses": qemuCurses,
      "kvm": qemuKVM,
      "usb": qemuUSB,
      "pcspk": qemuPCSpk,
      "qemuCommandAppend": qemuCommandAppend,
      "append": qemuAppend,
      "dryRun": dryRun,
      "virtioRng": qemuVirtioRng,
      "nographic": qemuNographic,
      "ports": extraPorts.filter(Boolean),
      "drives": drives.filter(Boolean)
    }, cb);
  });
};
