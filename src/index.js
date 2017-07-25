// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make.js
 * 
 * Makefile, build all tasks.
 */

import makeDll from './dll-builder'
//import makeApp from './app'
import defaultConfig from './default-config'
import type { WebpackOption } from './webpack-option-type'
import type { DllOption } from './dll-builder'
import type { Config } from './default-config'

type Option = {
  task: 'dll' | 'app' | 'service',
  options: DllOption
}

type CombineOption = DllOption & Config

function make(option: Option): WebpackOption | Array<WebpackOption> {
  const { task, ...options } = option
  let config = /*{*/ {} /*}*/
  const combineOption: CombineOption = {
    ...options,
    ...defaultConfig,
    ...config
  }

  switch (task) {
    case 'dll':
      return makeDll(combineOption)

    default:
      throw new Error(`[Builder] Unknow task ${task}`)
  }
}

export default make
