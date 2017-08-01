// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * default-config.js
 * 
 * Builder default config.
 */

import type { DllOption } from './dll-option'

export type Config = {
  path?: {
    src: string,
    tmp: string,
    dll: string,
    dist: string,
    deploy: string,
    app: {
      lib: string,
      core: string,
      component: string,
      view: string,
      helper: string,
      asset: string,
      font: string,
      image: string,
      style: string,
      data: string
    }
  },
  server: {
    host: string,
    port: number
  }
}

const defaultConfig: Config = {
  path: {
    src: 'src',
    tmp: 'tmp',
    dll: 'tmp/dll',
    dist: 'dist',
    deploy: 'dist/deploy',
    app: {
      lib: 'src/lib',
      core: 'src/core',
      component: 'src/components',
      view: 'src/views',
      helper: 'src/helpers',
      asset: 'assets',
      font: 'assets/fonts',
      image: 'assets/images',
      style: 'src/helpers/styles',
      data: 'assets/datas'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 2333
  },
  dll: null
}

export default defaultConfig
