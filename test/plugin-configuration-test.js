var async = require('async')
var spawn = require('child_process').spawn
var path = require('path')
var assert = require('assert')

var helper = require('./support/helper')

module.exports = function (cb) {
  async.series([
    vanillaTest,
    customizePlugins
  ], cb)
}

function vanillaTest (cb) {
  run('vanilla', function (er, code, log) {
    assert.equal(code, 0)

    helper.includes(log,
      'TAP version 13\n' +
      '1..2\n' +
      'ok 1 - "add" - test #1 in `test/simple-test.js`\n' +
      'ok 2 - "subtract" - test #2 in `test/simple-test.js`')

    cb(er)
  })
}

function customizePlugins (cb) {
  run('customize-plugins', function (er, code, log) {
    assert.equal(code, 0)

    helper.includes(log,
      'TAP version 13\n' +
      '1..2\n' +
      'About to run a before all\n' +
      'ok 1 - "add" - test #1 in `test/simple-test.js`\n' +
      'ok 2 - "subtract" - test #2 in `test/simple-test.js`\n' +
      'Sweet suite!')

    cb(er)
  })
}

function run (projectDir, cb) {
  test = spawn('npm', ['test'], {
    cwd: path.resolve(process.cwd(), 'test/fixtures/projects/' + projectDir)
  })

  var log = ''
  test.stdout.on('data', function (text) {
    log += text.toString()
  })
  test.stderr.on('data', function (text) {
    log += text.toString()
  })

  test.on('close', function (code) {
    cb(null, code, log)
  })
}
