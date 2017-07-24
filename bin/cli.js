#!/usr/bin/env node

/**
 * cli.js
 *
 * Main entry, generate `webpack.config.js` file.
 */

const { resolve } = require('path')
const webpack = require('webpack')
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const nodeExternals = require('webpack-node-externals')
const pkg = require('../package.json')

function main() {
  webpack({
    entry: pkg.name,
    output: {
      filename: 'webpack.config.js',
      libraryTarget: 'commonjs2',
      library: '[name]'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['react', ['env', {
                target: {
                  browsers: ['last 1 Chrome versions']
                },
                modules: false,
                loose: true
              }]],
              plugins: [
                ['transform-object-rest-spread', { 'useBuiltIns': true } ],
              ]
            }
          }, {
            loader: resolve(__dirname, 'loader.js') 
          }]
        }
      ]
    },
    target: 'node',
    node: false,
    plugins: [
      new ExternalsPlugin('commonjs', nodeExternals({
        whitelist: pkg.name
      }))
    ]

  }, function(err, stats) {
    if(err) {
      console.error(err.stack || err)

      if(err.details) {
        console.error(err.details)
      }

      return
    }

    const info = stats.toJson()

    if(stats.hasErrors()) {
      console.error(info.errors)
    }

    if(stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    console.log(stats.toString())
    
  })
}

main()
