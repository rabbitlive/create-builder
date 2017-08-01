// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make.js
 * 
 * Makefile, build all tasks.
 */

import makeLib from './lib-builder'
import defaultConfig from './default-config'
import type { WebpackOption } from './webpack-option-type'

type Option = {
  task: 'dll' | 'app' | 'service' | 'lib',
  options: DllOption
}

type CombineOption =
  | DllOption & Config

function make(option: Option): WebpackOption | Array<WebpackOption> {
  const { ...options } = option || {}
  let config: Config = /*config{*/ {} /*}*/
  let pkg: Object = /*pkg{*/ {} /*}*/
  const combineOption: CombineOption & { pkg: Object } = {    
      ...defaultConfig,
      ...config,
      ...options,
    pkg
  }

  return makeLib(combineOption)
}

export default make
