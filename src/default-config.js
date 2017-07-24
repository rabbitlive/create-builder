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
    asset: string,
    lib: string,
    core: string,
    component: string,
    view: string,
    image: string,
    style: string
  }
}

const defaultConfig: Config = {
  path: {
    src: 'src',
    tmp: 'tmp',
    dll: 'tmp/dll',
    dist: 'dist',
    deploy: 'dist/deploy',
    asset: 'asset',
    lib: 'src/lib',
    core: 'src/core',
    component: 'src/component',
    view: 'src/view',
    image: 'asset/images',
    style: 'src/lib/styles'
  },
  dll: null
}

export default defaultConfig
