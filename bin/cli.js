#!/usr/bin/env node

const { resolve } = require('path')
const webpack = require('webpack')
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const nodeExternals = require('webpack-node-externals')

function main() {
  webpack({
    entry: resolve('node_modules/builder/index.js'),
    output: {
      filename: 'webpack.config.js',
      libraryTarget: 'commonjs2',
      library: '[name]'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
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
          }
        }
      ]
    },
    target: 'node',
    node: false,
    plugins: [
      new ExternalsPlugin('commonjs', nodeExternals(this.options))
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
