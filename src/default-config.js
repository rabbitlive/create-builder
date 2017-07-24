// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * default-config.js
 * 
 * Builder default config.
 */

export type Config = {
  path: {
    src: string,
    tmp: string,
    dll: string,
    dist: string,
    deploy: string
  },
  dll: {
    hmr: boolean
  }
}

const defaultConfig: Config = {
  path: {
    src:    'src',
    tmp:    'tmp',
    dll:    'tmp/dll',
    dist:   'dist',
    deploy: 'dist/deploy'
  },
  dll: {
    hmr: true
  }
}

export default defaultConfig
