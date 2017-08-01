(function() {
  const config = require('${config}')
  const mod = config.default || config 
  if(typeof mod === 'function') {
    return mod()
  } else {
    return mod
  }
})()
