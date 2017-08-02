// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-production
 *
 * Build app on production mode.
 */

import { resolve, relative } from 'path'
import glob from 'glob'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import template from 'html-webpack-template'
import makeAlias from './app-namemapper'
import unpkgResolve from './unpkg-resolver'
import umdExternals from './umd-external'
import umdScripts from './umd-load-script'
import type { WebpackOption } from './webpack-option-type'
import {
  NamedModulesPlugin,
  DefinePlugin,
  EnvironmentPlugin,
  HashedModuleIdsPlugin,
  optimize as webpackOptimize
} from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
const { CommonsChunkPlugin, ModuleConcatenationPlugin } = webpackOptimize  

function makeApp(option: *) {
  const {
    path,
    server,
    pkg
  } = option
  const {
    src,
    dist,
    dll,
    app
  } = path

  const distPath: string = resolve(__dirname, dist)
  const umds: Array<CDNModule> = unpkgResolve(pkg, true)
  
  const entry: $PropertyType<WebpackOption, 'entry'> = {
    [pkg.name]: resolve(__dirname, 'src/index.js')
  }

  const output: $PropertyType<WebpackOption, 'output'> = {
    path: distPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  }

  const extractCSS = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    allChunks: true
  }) 

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
        use: extractCSS.extract({
          fallback: 'style-loader',          
          use: [
            'css-loader?modules=true&importLoaders=1&sourceMap',
            'postcss-loader?sourceMap'
          ] 
        })
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
    resolve: {
      alias: makeAlias(app)
    },
    //devtool: 'source-map', 
    devServer: {
      host: server.host,
      port: server.port,
      contentBase: distPath,
      publicPath: '/',
      historyApiFallback: true,
      hot: true
    },
    externals: umdExternals(umds),
    plugins: [
      new HtmlWebpackPlugin({
        title: '@Rabi ' + pkg.name,
        template: template,
        mobile: true,
        inject: false,
        appMountId: 'app',
        scripts: [
            ...umdScripts(umds)
        ]
      }),

      extractCSS,

      new ModuleConcatenationPlugin(),
      new EnvironmentPlugin(['NODE_ENV']),
      new HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CommonsChunkPlugin({
        name: 'runtime',
        minChunks: Infinity
      }),
    ]    
  }

  return webpackOption
}

export default makeApp
