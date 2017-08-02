// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * umd-external
 *
 * define webpack external with UMD lib.
 *
 * @param {Array<CDNModule>} modules - libs.
 * @return {Externals} 
 */

import CDNModule from './CDNModule'
import type { WebpackOption } from './webpack-option-type'

type Externals = $PropertyType<WebpackOption, 'externals'>

function makeExternal(modules: Array<CDNModule>): Externals {
  function folder(acc: Externals, cdn: CDNModule): Externals {
    return {
        ...acc,
      [cdn.name]: cdn.variable
    }
  }
  return modules.reduce(folder, {})
}

export default makeExternal
