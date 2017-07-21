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
import type { DllOption } from './dll/dll-options'

type Option = {
  task: 'dll' | 'app' | 'service',
  options: DllOption,
}

type Config = {
  path: {
    src: string,
    tmp: string,
    dll: string,
    dist: string,
    deploy: string
  }
}

const defaultConfig: Config = {
  path: {
    src: 'src',
    tmp: 'tmp',
    dll: 'tmp/dll',
    dist: 'dist',
    deploy: 'dist/deploy'
  }
}

function make(option: Option): any {
  const { task, ...opts } = option
  const combineOptions = {
      ...opts,
      ...defaultConfig,
      //...config
  }

  switch (task) {
    case 'dll':
      return makeDll(combineOptions)

    default:
      throw new Error(`[Builder] Unknow task ${task}`)
  }
}


export default make 
