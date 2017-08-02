// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * startcase-lib-name
 *
 * StartCase lib name from file basename.
 * Build-in:
 * 
 * 1. dom -> DOM
 *
 * @param {string} name - file basename.
 * @return string
 */

function mapper(name: string): string {
  name === 'dom'   
    ? 'DOM'
    : name.replace(/^([^])/, (_, a) => a.toUpperCase())
}

function startCase(name: string): string {
  const sp: Array<string> | string = name.split('-')
  
  if(!Array.isArray(sp)) {
    return mapper(sp)
  }

  return sp.map(mapper).join('')
}

export default startCase
