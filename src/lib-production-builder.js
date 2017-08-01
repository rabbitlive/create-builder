// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * lib-production-builder
 *
 * Build lib on production mode.
 */

import { resolve, relative } from 'path'
import glob from 'glob'
import nodeExternals from 'webpack-node-externals'
import type { WebpackOption } from './webpack-option-type'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import {
  NamedModulesPlugin,
  DefinePlugin,
  EnvironmentPlugin,
  ExternalsPlugin
} from 'webpack'


function makeApp(option: *) {
  const {
    path,
    server,
    pkg
  } = option
  const {
    src,
    dist,
  } = path

  const distPath: string = resolve(__dirname, dist)

  const webpackOption: WebpackOption = min => ({
    entry: {
      [pkg.name]: resolve(__dirname, 'src/index.js')
    },
    output: {
      path: distPath,
      filename: !min ? '[name].js' : '[name].min.js',
      libraryTarget: 'commonjs2',
      library: '[name]'
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          'cache-loader',
          'babel-loader?cacheDirectory'
        ]
      },{
        test: /\.css$/,
        use: [
          'style-loader&sourceMap',
          'css-loader?modules=true&importLoaders=1&sourceMap',
          'postcss-loader?sourceMap'
        ]
      },{
        test: /\.(png|jpg|gif)$/,
        use: [
          'url-loader?limit=5000'
        ]
      },{
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          'url-loader?limit=0'
        ]
      }]
    },
    target: 'node',
    node: false,
    stats: {
      maxModules: Infinity
    },
    plugins: [
      new ExternalsPlugin('commonjs', nodeExternals({
        whitelist: [
          pkg.name,
          /^webpack\/hot\/poll/
        ]
      })),

      //new DefinePlugin(mapRuntimeConfig(config)),
      new EnvironmentPlugin(['NODE_ENV']),

        ...[ min && new UglifyJSPlugin() ]
    ].filter(Boolean)
  })

  return [true, false].map(webpackOption)
}

export default makeApp
