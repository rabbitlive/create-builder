// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-hmr
 *
 * Build React HMR dlls.
 *
 * @param {string} path - Dll directory absolute path.
 * @return {WebpackOption}
 */

import dlloption from './dll-option'
import type { WebpackOption } from './webpack-option-type'

function makeVendorDll(path: string): WebpackOption {
  return dlloption({
    entry: {
      hmr: [
        'react-hot-loader/patch',
        'react-hot-loader',
        'webpack-dev-server/client'
      ]
    },
    path
  })
}

export default makeVendorDll
