// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make.js
 * 
 * Makefile, build all tasks.
 */

import makeDll from './dll-builder'
import makeLib from './lib-builder'
import makeApp from './app-builder'
import defaultConfig from './default-config'
import type { WebpackOption } from './webpack-option-type'
import type { DllOption } from './dll-builder'
import type { Config } from './default-config'

type Option = {
  task: 'dll' | 'app' | 'service',
  options: DllOption
}

type CombineOption =
  | DllOption & Config

function make(option: Option): WebpackOption | Array<WebpackOption> {
  const { task, ...options } = option
  let config: Config = /*config{*/ {} /*}*/
  let pkg: Object = /*pkg{*/ {} /*}*/
  const combineOption: CombineOption & { pkg: Object } = {    
      ...defaultConfig,
      ...config,
      ...options,
    pkg
  }

  switch (task) {
    case 'dll':
      return makeDll(combineOption)
    case 'lib':
      return makeLib(combineOption)
    case 'app':
      return makeApp(combineOption)
    default:
      throw new Error(`[Builder] Unknow task ${task}`)
  }
}

export default make
