#!/usr/bin/env node

/**
 * cli.js
 *
 * CLI main. Generate `webpack.config.js` file.
 */

const { resolve } = require('path')
const webpack = require('webpack')
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const nodeExternals = require('webpack-node-externals')
const pkg = require('../package.json')

function main() {
  webpack({
	  entry: resolve(__dirname, '../src/lib.js'),
	  output: {
	    filename: 'webpack.config.js',
	    libraryTarget: 'commonjs2',
	    library: '[name]'
	  },
	  module: {
	    rules: [{
		    test: /\.js$/,
		    use: [
          'babel-loader',
          resolve(__dirname, 'loader.js')
        ]
		  }]
	  },
	  target: 'node',
	  node: false,
	  plugins: [
	    new ExternalsPlugin('commonjs', nodeExternals({
		    whitelist: pkg.name
		  }))
	  ]
  }, function(err, stats) {
	  if (err) {
	    console.error(err.stack || err)

	    if (err.details) {
		    console.error(err.details)
	    }

	    return
	  }

	  const info = stats.toJson()

	  if (stats.hasErrors()) {
	    info.errors.forEach(console.error)
	  }

	  if (stats.hasWarnings()) {
	    info.warnings.forEach(console.warn)
	  }

	  console.log(stats.toString({
	    chunks: false,
	    colors: true,
	    maxModules: Infinity
	  }))
  })
}

main()
