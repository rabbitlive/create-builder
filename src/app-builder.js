// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-builder
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
import makeDevelopmentApp from './app-development'
import makePrereleaseApp from './app-prerelease'

function makeApp(
  option: *
): WebpackOption | Array<WebpackOption> {

  switch (process.env.NODE_ENV) {
    case 'prerelease':
      return makePrereleaseApp(option)
    // case 'production':
    //   return makeProdutionApp()
    case 'development':
    default:
      return makeDevelopmentApp(option)
  }
}

export default makeApp
