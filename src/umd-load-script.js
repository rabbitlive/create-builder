// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * umd-load-script
 *
 * define webpack external with UMD lib.
 *
 * @param {Array<CDNModule>} modules - libs.
 * @return {Externals} 
 */

import CDNModule from './CDNModule'

function makeScripts(modules: Array<CDNModule>): Array<string> {
  function mapper(cdn: CDNModule): string {
    return cdn.url
  }
  return modules.map(mapper)
}

export default makeScripts
