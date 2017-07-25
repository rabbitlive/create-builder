/**
 * loader.js
 *
 * Load config file inject to `src/index.js`.
 */

const { exists } = require('fs')
const { resolve, sep } = require('path')

module.exports = function(content, options) {
  let out = content
  const callback = this.async()

  if (!this.request.match(/src(\/|\\)index\.js$/)) {
    callback(null, content)
  } else {
    const config = resolve('./rabi.js')
    exists(config, isExists => {
      if (!isExists) {
        callback(null, content)
      } else {
        const REGEX_HOOK = /\/\*\{\*\/[^\/]+\/\*\}\*\//
        const tpl = `\
(function() {
const configFile = require('${config.split(sep).join('/')}')
const mod = configFile.default || configFile 
if(typeof mod === 'function') {
  return mod()
} else {
  return mod
}
})()
`
        callback(null, content.replace(REGEX_HOOK, tpl))
      }
    })
  }
}
