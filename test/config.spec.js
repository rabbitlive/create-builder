// -*- mode: js -*-
// -*- coding: utf-8 -*-

import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import child_process from 'child_process'
import del from 'del'
import glob$ from 'glob'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000

const name = 'test-config'
const dir = resolve(__dirname, name)

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const exec = promisify(child_process.exec)
const glob = promisify(glob$)

beforeAll(() => {
  return del(dir)
    .then(() => mkdir(dir))
    .then(() => writeFile(resolve(dir, 'package.json'), JSON.stringify({ name })))
    .then(() => writeFile(resolve(dir, '.babelrc'), JSON.stringify({
      "presets": ["react", ["env", {
	"target": {
	  "browsers": ["last 1 Chrome versions"]
	},
	"modules": false,
	"loose": true
      }]],
      "plugins": [
	["transform-object-rest-spread", { "useBuiltIns": true } ],
      ],
      "env": {
	"test": {
	  "plugins": ["transform-es2015-modules-commonjs"]
	}
      }
    })))
})

afterAll(() => {
  return del(dir)
})

test('Build all dll when config file set hmr to `true`', () => {
  const cwd = process.cwd()
  return writeFile(resolve(dir, 'rabi.js'), `\
export default function() {
  return { 
    dll: 'all'
  }
}
`)
    .then(() => exec(`yarn link`))
    .then(() => process.chdir(dir))
    .then(() => exec(`yarn add --offline react react-dom`))
    .then(() => exec(`yarn add --offline --dev \
react-hot-loader@3.0.0-beta.7 \
webpack \
webpack-dev-server \
babel-core babel-loader \
babel-preset-env babel-preset-react \
babel-plugin-transform-object-rest-spread`))
    .then(() => exec(`yarn link @rabi/builder`))
    .then(() => exec(`node node_modules/@rabi/builder/bin/cli.js & yarn webpack -- --env.task=dll`))
    .then(() => glob(resolve(dir, 'tmp/dll') + '/*'))
    .then(data => {
      return expect(data.length).toBe(4)
    })
    .then(() => process.chdir(cwd))
    .then(() => del(dir))
})
