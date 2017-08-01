// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * CDNModule
 *
 * Define CDNModule Object.
 *
 * @param {string} options.name - lib name.
 * @param {string} options.variable - lib export global name.
 * @param {string} options.url - lib CDN url.
 * @param {string} options.version - lib version.
 * @return {CDNModule}
 */

class CDNModule {
  constructor(options = {}) {
    const {
      name,
      variable,
      url,
      version
    } = options
    
    this.name = name
    this.variable = variable
    this.url = url
    this.version = version
  }
  toString() {
    return `\
CDNModule { 
  name     = ${this.name}
  url      = ${this.url}
  version  = ${this.version}
  variable = ${this.name}
}`
  }
  static of(options) {
    return new CDNModule(options) 
  }
}

export default CDNModule
