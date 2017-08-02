// -*- mode: js -*-
// -*- coding: utf-8 -*-

/**
 * loader.js
 *
 * Inject config file and package.json to entry file.
 */

const fs   = require('fs')
const path = require('path')


/**
 * Replacer type.
 *
 * @class  
 */
class Replacer {
  /** 
   * @constructor
   * @param {string} filepath
   * @param {string} template
   * @param {string} regexp
   */
  constructor(options = {}) {
    const { filepath, template, regexp } = options
    
    this.filepath = filepath
    this.template = template
    this.regexp   = regexp
  }
}


/**
 * replaceContent
 *
 * @param {Replacer} replacer
 * @param {string} content - entry file content
 * @return {Promise<string>}
 */
function replaceContent(replacer) {
  return function(content) {
    return new Promise(function(resolve, reject) {
      // Test file was not exists.
      fs.access(replacer.filepath, err => {
        if(err) {
          resolve(content)
          return
        }

        // Replace hook.
        resolve(
          content.replace(replacer.regexp, replacer.template)
        )
      })
    })
  }
}


/**
 * Main
 */
function loader(content, options) {
  /**
   * Webpack async loader callback.
   */ 
  const callback = this.async()

  /** 
   * Match the entry file.
   *
   * 1. `index` for app builder
   * 2. `lib` for lib builder
   */
  const REGEX_ENTRY = /src(\/|\\)(index|lib)\.js$/i
  
  if (!this.request.match(REGEX_ENTRY)) {
    callback(null, content)
    return
  }

  /**
   * Replace contents by HOOK.
   *
   * 1. Replace config file `rabi.js`
   * 2. Replace `package.json` 
   */
  const config = path.resolve('./rabi.js')
  const pkg    = path.resolve('./package.json')
  
  const rc_config = new Replacer({
    filepath: config,
    regexp: /\/\*config\{\*\/[^\/]+\/\*\}\*\//,
    template: `\
(function() {
const configFile = require('${config.split(path.sep).join('/')}')
const mod = configFile.default || configFile 
if(typeof mod === 'function') {
  return mod()
} else {
  return mod
}
})()
`})
  const rc_pkg = new Replacer({
    filepath: pkg,
    regexp: /\/\*pkg\{\*\/[^\/]+\/\*\}\*\//,
    template: `require('${pkg.split(path.sep).join('/')}')`
  })

  /**
   * Main process.
   */
  Promise.resolve(content)
    .then(replaceContent(rc_config))
    .then(replaceContent(rc_pkg))
    .catch(callback)
    .then(content => callback(null, content))
}


module.exports = loader
