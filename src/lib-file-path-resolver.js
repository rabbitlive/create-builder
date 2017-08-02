// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * lib-file-path-resolver
 *
 * Find lib bundles path
 *
 * @param {string} path - the UMD lib file path.
 * @return string
 */

import glob from 'glob'

function findBundleFile(pkg: Object, lib: string, compress?: boolean): ?string {
  const paths: Array<string> = glob.sync(`node_modules/${lib}/+(dist|umd)/${lib}.?(min.)js`)
  if(!paths.length) {
    
    const main: string = pkg.main
    if(!main) {
      if(process.env.NODE_ENV === 'development') {
        console.log(`Can't find main property at 'package.json'`)
      }

      const mainfiles: Array<string> = glob.sync(`node_modules/${lib}/+(index|${lib}).js`)
      if(!mainfiles.length) {
        if(process.env.NODE_ENV === 'development') {
          console.error(`Can't find ${lib} lib file.`)
        }

        return
      }

      return mainfiles[0]
    }

    return `node_modules/${lib}/${main}`
  }

  if(paths.length === 1) {
    console.log(`The ${lib} only have one file with ${paths[0]}.`)
    return paths[0]
  }

  if(!compress) {
    const min: Array<string> = paths.filter(x => x.match('min'))
    
    if(!min.length) {
      console.log(`The ${lib} can't has compress version.`)
      return paths[0]
    }

    return min[0]
  }

  return paths[0]
}

export default findBundleFile
