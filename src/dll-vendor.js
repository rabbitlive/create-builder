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

import { readFileSync } from 'fs'
import { resolve } from 'path'
import dlloption from './dll-option'
import type WebpackOption from './webpack-option-type'

function makeVendorDll(path: string): WebpackOption {
  const pkg = JSON.parse(readFileSync(resolve(process.cwd(), './package.json'), 'utf8'))

  return dlloption({
    entry: { vendor: Object.keys(pkg.dependencies) },
    path
  })
}

export default makeVendorDll
