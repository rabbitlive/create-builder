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
import type WebpackOption from './webpack-option-type'
import makeVendorDll from './dll-vendor'
import makeHMRDll from './dll-hmr'

type Option = {
  dll: 'vendor' | 'hmr'  
}

export default function makeDll(option: Option): WebpackOption | Array<WebpackOption> {
  const { dll: task, path } = option
  const { dll: dllDir } = path
  
  const dllPath: string = resolve(__dirname, dllDir)

  switch (task) {
    case 'vendor':
      return makeVendorDll(dllPath)
    case 'hmr':
      return makeHMRDll(dllPath)
    default:
      return [makeVendorDll(dllPath), makeHMRDll(dllPath)]
  }
}
