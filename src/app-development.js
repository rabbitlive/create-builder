// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-development
 *
 * Build app on development mode.
 */

import { resolve } from 'path'
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
    server
  } = option
  const {
    src,
    tmp,
    dll,
    app
  } = path
  const {
    host,
    port
  } = server
  
  const pkg = resolve(process.cwd(), './package.json')
  const dlls: Array<[string, DllReferencePlugin]> = checkDlls(dll)
  const entry = {
    [name]: [
      'react-hot-loader/patch',
      resolve(__dirname, 'src/index.js')
    ]
  }

  return {
    entry: {
      app: [
        'react-hot-loader/patch',
        resolve(__dirname, 'src/index.js')
      ]
    },
    output: {
      path: resolve(__dirname, tmp),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/'
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          'cache-loader',
          'thread-loader?workers=2',
          'babel-loader'
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
    devServer: {
      host: host || '0.0.0.0',
      port: port || '2333',
      contentBase: resolve(__dirname, tmp),
      publicPath: '/',
      historyApiFallback: true,
      hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.name,
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
}

function checkDlls(dll: string): Array<[string, DllReferencePlugin]> {
  const manifests: Array<string> = glob.sync(dll + '/*.json')
  const dllPath: string = resolve(__dirname, dll)
  return manifests.map(manifest => {
    const name: string = manifest.match(/\/([^\/]+)-manifest\.json$/)[1]
    return [dllScript(dll)(name), dllRefer(dllPath)(name)]
  })
}

function defineAlias(name: string, path: string): ?{ [string]: string } {
  if(!path) {
    return null
  }

  return {
    [name]: resolve(__dirname, path)
  }
}

export default makeApp
