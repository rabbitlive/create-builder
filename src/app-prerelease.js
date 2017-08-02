// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-prerelease
 *
 * Build app on prerelease mode.
 */

import { resolve, relative } from 'path'
import glob from 'glob'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import template from 'html-webpack-template'
import { NamedModulesPlugin, DefinePlugin, EnvironmentPlugin } from 'webpack'
import makeAlias from './app-namemapper'
import unpkgResolve from './unpkg-resolver'
import umdExternals from './umd-external'
import umdScripts from './umd-load-script'
import type { WebpackOption } from './webpack-option-type'

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
  const umds: Array<CDNModule> = unpkgResolve(pkg, false)
  
  const entry: $PropertyType<WebpackOption, 'entry'> = {
    [pkg.name]: resolve(__dirname, 'src/index.js')
  }

  const output: $PropertyType<WebpackOption, 'output'> = {
    path: tmpPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  }

  const webpackOption: WebpackOption = {
    entry,
    output,
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          'cache-loader',
          //'thread-loader?workers=2',
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
    resolve: {
      alias: makeAlias(app)
    },
    externals: umdExternals(umds),
    devtool: 'source-map', 
    devServer: {
      host: server.host,
      port: server.port,
      contentBase: tmpPath,
      publicPath: '/',
      historyApiFallback: true,
    },
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

      //new NamedModulesPlugin(),
      //new DefinePlugin(mapRuntimeConfig(config)),
      new EnvironmentPlugin(['NODE_ENV']),
    ]  
  }

  return webpackOption
}

export default makeApp
