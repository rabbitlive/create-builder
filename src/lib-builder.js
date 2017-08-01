// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * lib-builder
 *
 * Build app with multi mode.
 * 
 * 1. Development mode
 *
 * Enable sourcemap for debug. Rich development log. Re-compile when 
 * file content change. Enable HMR if it's possible.
 * 
 * 2. Prerelease mode
 *
 * Bundle source code, drop 3rd libs, use `unpkg.com` CDN version instead. 
 *
 * 3. Production mode
 *
 * Also bundle code to one. Enable code compression. Generate manifest
 * for long team cache. Test with nginx.
 */

import { resolve } from 'path'
import type { WebpackOption } from './webpack-option-type'
import makeDevelopmentLib from './lib-development-builder'
import makeProductionLib from './lib-production-builder'

function makeLib(
  option: *
): WebpackOption | Array<WebpackOption> {

  switch (process.env.NODE_ENV) {
    case 'production':
      return makeProductionLib(option)
    case 'development':
    default:
      return makeDevelopmentLib(option)
  }
}

export default makeLib
