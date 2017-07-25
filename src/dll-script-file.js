// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-script-file
 *
 * Load dll file as a script tag on main app html file.
 *
 * @param {string} dir - dlls directory name
 * @param {string} name - dll name.
 * @return {string}
 */

function dllScriptFile(dir: string): * {
  return function(name: string): string {
    return `/${dir}/${name}.js`
  }
}

export default dllScriptFile
