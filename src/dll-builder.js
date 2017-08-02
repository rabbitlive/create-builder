// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-builder
 *
 * Build webpack dlls.
 *
 * 1. Build app dependencies.
 * 2. Build hmr dependencies.
 */

import { resolve } from 'path'
import type { WebpackOption } from './webpack-option-type'
import makeVendorDll from './dll-vendor'
import makeHMRDll from './dll-hmr'

export type DllOption = {
  dll?: 'vendor' | 'hmr' | 'all',
  dllWebpackOption?: WebpackOption,
  vendorDllWebpackOption?: WebpackOption,
  hmrDllWebpackOption?: WebpackOption
}

function makeDll(
  option: *
): WebpackOption | Array<WebpackOption> {
  const {
    dll: task,
    path,
    dllWebpackOption,
    vendorDllWebpackOption,
    hmrDllWebpackOption
  } = option
  const { dll: dllDir } = path
  const dllPath: string = resolve(__dirname, dllDir)

  // TODO Merge multi options use webpack-merge.
  switch (task) {
    case 'hmr':
      return makeHMRDll(dllPath, hmrDllWebpackOption || dllWebpackOption)
    case 'all':
      return [
        makeVendorDll(dllPath, vendorDllWebpackOption || dllWebpackOption),
        makeHMRDll(dllPath, hmrDllWebpackOption || dllWebpackOption)
      ]
    case 'vendor':
    default:
      return makeVendorDll(dllPath, vendorDllWebpackOption || dllWebpackOption)
  }
}

export default makeDll
