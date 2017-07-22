// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'
import rimraf from 'rimraf'

const dir = resolve(__dirname, 'test-dll')

beforeAll(() => {
  if(existsSync(dir)) {
    rimraf.sync(dir)
  }
  
  mkdirSync(dir)
})

afterAll(() => {
  rimraf.sync(dir)
})

test('Build vendor dll from `package.json`', () => {
  const tpl = {
    name: "test-dll"
  }
  writeFileSync(resolve(dir, 'package.json'), JSON.stringify(tpl))

  const babelrc = {
    "presets": ["react", ["env", {
      "target": {
        "browsers": ["last 1 Chrome versions"]
      },
      "modules": false,
      "loose": true
    }]],
    "plugins": [
      ["transform-object-rest-spread", { "useBuiltIns": true } ],
      "syntax-dynamic-import",
      "transform-class-properties",
      "lodash"
    ],
    "env": {
      "test": {
        "plugins": ["transform-es2015-modules-commonjs"]
      }
    }
  }
  writeFileSync(resolve(dir, '.babelrc'), JSON.stringify(babelrc))
  
  process.chdir(dir)
  execSync(`yarn add react react-dom`)
  execSync(`yarn add --dev \
react-hot-loader@next \
webpack \
webpack-dev-server \
babel-core babel-loader \
babel-preset-env babel-preset-react \
babel-plugin-transform-object-rest-spread \
https://github.com/rabbitlive/builder.git#development`)
  execSync(`yarn rabi-builder`)
  execSync(`yarn webpack -- --env.task=dll`)

  expect(
    [
      existsSync(resolve(dir, 'tmp/dll/vendor.js')),      
      existsSync(resolve(dir, 'tmp/dll/hmr.js')),
      Object.keys(JSON.parse(readFileSync(resolve(dir, 'tmp/dll/vendor-manifest.json'), 'utf-8')).content).length > 0,
      Object.keys(JSON.parse(readFileSync(resolve(dir, 'tmp/dll/hmr-manifest.json'), 'utf-8')).content).length > 0
    ]
  ).toEqual(
    [
      true,
      true,
      true,
      true
    ]
  )
})
