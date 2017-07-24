// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-vendor
 *
 * Build vendor dlls.
 *
 * @param {string} path - Dll directory absolute path.
 * @return {WebpackOption}
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import dlloption from './dll-option'
import type { WebpackOption } from './webpack-option-type'

function makeVendorDll(path: string): WebpackOption {
  // Read root package.json file.
  const pkgPath: string = resolve(process.cwd(), './package.json')
  const isExists: boolean = existsSync(pkgPath)

  if (!isExists) {
    console.error('Not found `package.json` in your root dir.')
  }

  // Read dependencies.
  const pkg: Object = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const deps: ?Object = pkg.dependencies

  if (!deps) {
    console.warn(
      "Can't find any dependencies in dependencies property of `package.json` file"
    )
  }

  return dlloption({
    entry: { vendor: Object.keys(deps || {}) },
    path
  })
}

export default makeVendorDll
