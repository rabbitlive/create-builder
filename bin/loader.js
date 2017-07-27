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
    const pkg = resolve('./package.json')
    exists(config, isExists => {
      if (!isExists) {
        callback(null, content)
      } else {
        const configTpl = `\
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
        const pkgTpl = `require('${pkg.split(sep).join('/')}')`
        const replacedContent = content
                 .replace(/\/\*config\{\*\/[^\/]+\/\*\}\*\//, configTpl)
              .replace(/\/\*pkg\{\*\/[^\/]+\/\*\}\*\//, pkgTpl)
        
        callback(null, replacedContent)
      }
    })
  }
}
