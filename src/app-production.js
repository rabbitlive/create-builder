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
import { NamedModulesPlugin, DefinePlugin, EnvironmentPlugin, DllReferencePlugin } from 'webpack'
import dllScript from './dll-script-file'
import dllRefer from './dll-ref-plugin'
import makeAlias from './app-namemapper'
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
  const dllPath: string = resolve(__dirname, dll)
  const dlls: Array<[string, DllReferencePlugin]> = checkDlls(dllPath)
  
  const entry: $PropertyType<WebpackOption, 'entry'> = {
    [pkg.name]: [
      'react-hot-loader/patch',
      resolve(__dirname, 'src/index.js')
    ]
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
    devtool: 'source-map', 
    devServer: {
      host: server.host,
      port: server.port,
      contentBase: [tmpPath, dllPath],
      publicPath: '/',
      historyApiFallback: true,
      hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: '@Rabi ' + pkg.name,
        template: template,
        mobile: true,
        inject: false,
        appMountId: 'app',
        scripts: [
            ...dlls.map(x => x[0])
        ]
      }),

      new NamedModulesPlugin(),
      //new DefinePlugin(mapRuntimeConfig(config)),
      new EnvironmentPlugin(['NODE_ENV']),
    ].concat([
        ...dlls.map(x => x[1])
    ])    
  }

  return webpackOption
}

function checkDlls(dllPath: string): Array<[string, DllReferencePlugin]> {
  const manifests: Array<string> = glob.sync(dllPath + '/*.json')
  return manifests.map(manifest => {
    const name: string = manifest.match(/\/([^\/]+)-manifest\.json$/)[1]
    return [dllScript(name), dllRefer(dllPath)(name)]
  })
}

export default makeApp
