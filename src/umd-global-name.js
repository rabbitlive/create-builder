// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * umd-global-name
 *
 * Extract umd global name from head object.
 *
 * @param {string} path - the UMD lib file path.
 * @return string
 */

import { resolve, basename } from 'path'
import { readFileSync } from 'fs'
import { runInNewContext } from 'vm'
import findBundleFile from './lib-file-path-resolver'
import startCase from './startcase-lib-name'

function umdName(pkg: Object, name: string, compress: boolean, fallback?: string): string {
  const sendbox = {
    window: {},
    deps: {},
    callback: name => readFileSync(resolve(process.cwd(), findBundleFile(pkg, name, compress)), 'utf-8')
  }
  const window: { [string]: any } = {}
  const deps = {}
  
  let define
  
  const path: string = findBundleFile(pkg, name, compress)

  function doFallback(): string {
    if(!fallback) {
      console.log(`Can't provide fallback name, format name as StartCase.`)

      const splitPath: Array<string> = basename(path).split('.')
      
      if(!splitPath.length) {
        throw new Error(`Error file name ${basename(path)}`)
      }

      return startCase(splitPath[0])
    }

    return fallback
  }

  try {
    sendbox.script = readFileSync(resolve(process.cwd(), path), 'utf-8')
    
    runInNewContext(`
var define = d => deps = d
define.amd = 1
eval(script)
define = undefined

if(deps.length) {
  deps.forEach(d => {
    eval(callback(d))
  })
}

eval(script)
`, sendbox)

  } catch(err) {
    if(process.env.NODE_ENV !== 'production') {
      console.error(err)
    }
    console.log(`Can't extract UMD global name from ${path}, use fallback name.`)
    
    return doFallback()
  }

  const names: string = Object.keys(sendbox.window)

  if(!names.length) {
    return doFallback()
  }

  return names.slice(-1)[0]
}

export default umdName
