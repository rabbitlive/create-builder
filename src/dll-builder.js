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
  dll: 'vendor' | 'hmr'  
}

export default function makeDll(option: *): WebpackOption | Array<WebpackOption> {
  const { dll: task, path } = option
  const { dll: dllDir } = path

  // TODO
  console.log(option)

  const dllPath: string = resolve(__dirname, dllDir)

  switch (task) {
    case 'hmr':
      return makeHMRDll(dllPath)
    case 'all':
      return [
	      makeVendorDll(dllPath),
	      makeHMRDll(dllPath)
      ]
    case 'vendor':
    default:
      return makeVendorDll(dllPath)
  }
}
