#!/usr/bin/env node
import program from 'commander'
import * as cos from './cos'
// tsc编译输出目录比当前目录多一级，暂时不知道怎么处理

// eslint-disable-next-line @typescript-eslint/no-require-imports
const version = require('../package.json').version

function check(action, regex) {
  return function (v, vv) {
    if (regex) {
      if (regex.test(v)) {
        return v
      }
      console.error(
        `Fail to map (${regex}). Check the options by "antm-upload-tencent ${action} --help"`,
      )
      process.exit(1)
    } else {
      if (!v) {
        return vv
      }

      return v
    }
  }
}

program.version(version, '-v, --version')

program
  .command('upload')
  .description('Upload files to cos.')
  .action(cos.upload)
  .usage('[command] <options ...>')
  .option('-d, --dir <dir>', 'The dir you need to upload.')
  .option('-fp, --file-path <filePath>', 'The file path you need to upload.')
  .option('-td, --target-dir <targetDir>', 'The target dir you need to upload.')
  .option('-er, --exclude-regexp <excludeRegexp>', 'The file path you want to exclude to upload.')
  .option('-r, --redirect', 'upload redirect')
  .option('-nrf, --no-random-filename', 'no random filename')
  .on('--help', () => {
    console.info()
    console.info('  Example:')
    console.info()
    console.info('  # Upload files to cos.')
    console.info(
      '  $ antm-upload-tencent upload --dir xxx --file-path xxx --exclude-regexp "(.+?).map"',
    )
    console.info()
  })

program
  .command('bundle')
  .description('Upload dist to cos.')
  .action(cos.bundle)
  .usage('[command] <options ...>')
  .option(
    '-td, --target-dir <targetDir>',
    'The target dir you need to upload. [eg: /^[^/].*/]',
    check('bundle', /^[^/].*/),
  )
  .option('-d, --dir <dir>', 'The dir you need to upload.')
  .option('-er, --exclude-regexp <excludeRegexp>', 'The file path you want to exclude to upload.')
  .on('--help', () => {
    console.info()
    console.info('  Example:')
    console.info()
    console.info('  # Upload dist to cos.')
    console.info(
      '  $ antm-upload-tencent bundle --target-dir xxx --dir xxx --exclude-regexp "(.+?).map"',
    )
    console.info()
  })

program.parse(process.argv)
