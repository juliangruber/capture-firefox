'use strict'

const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const mkdir = promisify(require('fs').mkdir)
const tempDir = require('temp-dir')
const firefox = require('firefox-nightly-prebuilt')
const escape = require('shell-escape')

const profile = `user_pref('browser.shell.checkDefaultBrowser', false);\n`

module.exports = async ({ url, width: width = 1024, height: height = 768 }) => {
  const cwd = `${tempDir}/${Date.now()}${Math.random().toString(16).slice(2)}`
  console.log(cwd)
  await mkdir(cwd)
  await writeFile(`${cwd}/user.js`, profile)

  await exec(
    escape([
      firefox,
      '-profile', cwd,
      '-screenshot',
      `-window-size=${width},${height}`,
      url
    ]),
    { cwd }
  )
  return readFile(`${cwd}/screenshot.png`)
}
