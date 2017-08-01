// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-namemapper
 *
 * Alias for application directories.
 */

import { resolve } from 'path'
import config from './default-config'
import type { Config } from './default-config' 

type Alias = {
  [string]: string
}

type AppPath = $PropertyType<$PropertyType<Config, 'path'>, 'app'>

function defineAlias(paths: AppPath): * {
  return function(name: string): ?Alias {
    const path: string = paths[name]
    
    if(!path) {
      return null
    }

    return {
      [name]: resolve(__dirname, path)
    }
  }  
}

function makeAlias(path: AppPath): Alias {
  const define = defineAlias(path)

  function combine(acc, key) {
    return { ...acc, ...define(key) } 
  }

  // TODO Add custom alias config.
  const buildin: Alias = Object.keys(config).reduce(combine, {}) 
  
  return buildin
}

export default makeAlias
