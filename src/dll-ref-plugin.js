// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-ref-plugin
 *
 * Link dll libs with webpack DllReferencePlugin.
 *
 * @param {string} path - dlls directory absolute path.
 * @param {string} name - dll file name.
 * @return {DllReferencePlugin} 
 */

import { resolve } from 'path'
import { DllReferencePlugin } from 'webpack'

const suffix: string = 'manifest.json'

function dllRefPlugin(path: string): * {
  return function(name: string): DllReferencePlugin {
    const manifestFileName: string = `${name}-${suffix}`

    return new DllReferencePlugin({
      context: '.',
      manifest: resolve(path, manifestFileName)
    })
  }
}

export default dllRefPlugin
