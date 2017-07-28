// -*- mode: js -*-
// -*- coding: utf-8 -*-

/**
 * loader.js
 *
 * Inject config file and package.json into to `src/index.js`.
 */

const { access } = require('fs')
const { resolve, sep } = require('path')

function replaceSeq(path) {
  return path.split(sep).join('/')
}

module.exports = function(content, options) {
  let out = content
  const callback = this.async()

  if (!this.request.match(/src(\/|\\)index\.js$/)) {
    callback(null, content)
    return
  }
  
  const config = resolve('./rabi.js')
  const pkg = resolve('./package.json')

  Promise.resolve(content)
    .then(content => {
      return new Promise(function(resolve, reject) {
        access(config, err => {
          if(err) {
            resolve(content)
            return
          }

          const regex = /\/\*config\{\*\/[^\/]+\/\*\}\*\//i
          const tpl = `\
(function() {
const configFile = require('${replaceSeq(config)}')
const mod = configFile.default || configFile 
if(typeof mod === 'function') {
  return mod()
} else {
  return mod
}
})()
`
          resolve(content.replace(regex, tpl))
        })
      })
    })
    .then(content => {
      return new Promise(function(resolve, reject) {
        access(pkg, err => {
          if(err) {
            resolve(content)
            return
          }

          const regex = /\/\*pkg\{\*\/[^\/]+\/\*\}\*\//i
          const tpl = `require('${replaceSeq(pkg)}')`
          resolve(content.replace(regex, tpl))
        })
      })
    })
    .catch(err => {
      callback(err)
    })
    .then(content => {
      callback(null, content)
    })
}
