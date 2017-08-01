// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * unpkg-resolver
 *
 * Find modules from 'unpkg.com'
 *
 * @param {Object} pkg - the UMD lib file path.
 * @param {boolean} compress - use compress lib version.
 * @return {Array<CDNModule>}
 */

import { relative, sep } from 'path'
import findBundleFile from './lib-file-path-resolver'
import umdName from './umd-global-name'
import CDNModule from './CDNModule'

function unpkgResolve(pkg: Object, compress?: boolean): Array<CDNModule> {
  const deps: { [string]: string } = pkg.dependencies

  function mapper(key: string): Array<?CDNModule> {
    const name: string = key
    const version: string = deps[key]
    const nodeModulePath: string = findBundleFile(pkg, name, compress)
    
    if(!nodeModulePath) {
      return null
    }
    
    const filePath: string = relative(`node_modules/${name}`, nodeModulePath).split(sep).join('/')
    const url: string = `https://unpkg.com/${name}@${version}/${filePath}`
    const variable: string = umdName(pkg, name, compress)
    
    return CDNModule.of({ name, variable, url, version })
  }
  
  return Object.keys(deps).map(mapper).filter(Boolean)
}

export default unpkgResolve
