#!/usr/bin/env node

/**
 * cli.js
 *
 * Main entry. Generate `webpack.config.js` file.
 *
 * @require babel-plugin-transform-object-rest-spread
 */

const { resolve } = require('path')
const webpack = require('webpack')
const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const nodeExternals = require('webpack-node-externals')
const pkg = require('../package.json')

function main() {
  webpack(
    {
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
            use: ['babel-loader', resolve(__dirname, 'loader.js')]
          }
        ]
      },
      target: 'node',
      node: false,
      plugins: [
        new ExternalsPlugin(
          'commonjs',
          nodeExternals({
            whitelist: pkg.name
          })
        )
      ]
    },
    function(err, stats) {
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
    }
  )
}

main()
