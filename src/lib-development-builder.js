// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * lib-development-builder
 *
 * Build lib on development mode.
 */

import { resolve, relative } from 'path'
import glob from 'glob'
import nodeExternals from 'webpack-node-externals'
import type { WebpackOption } from './webpack-option-type'
import {
  NamedModulesPlugin,
  DefinePlugin,
  EnvironmentPlugin,
  ExternalsPlugin,
  HotModuleReplacementPlugin
} from 'webpack'


function makeApp(option: *) {
  const {
    path,
    server,
    pkg
  } = option
  const {
    src,
    tmp,
    dll,
    app
  } = path

  const tmpPath: string = resolve(__dirname, tmp)
  
  const entry: $PropertyType<WebpackOption, 'entry'> = {
    [pkg.name]: [
      'webpack/hot/poll?1000',
      resolve(__dirname, 'src/boot.js')
    ]
  }

  const output: $PropertyType<WebpackOption, 'output'> = {
    path: tmpPath,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    library: '[name]'
  }

  const webpackOption: WebpackOption = {
    entry,
    output,
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
    devtool: 'source-map',
    watch: true,
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

      new HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
      //new DefinePlugin(mapRuntimeConfig(config)),
      new EnvironmentPlugin(['NODE_ENV']),
    ]
  }

  return webpackOption
}

export default makeApp
