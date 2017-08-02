// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-option
 *
 * Dll commons webpack options.
 *
 * @param {option.path} option.path - dlls directory absolute path.
 * @param {Array<string> | { [string]: string }} option.entry - dll libs list.
 * @return {WebpackOption}
 */

import { resolve } from 'path'
import { DllPlugin } from 'webpack'
import type { WebpackOption } from './webpack-option-type'

type DllWebpackOption = {
  entry: $PropertyType<WebpackOption, 'entry'>,
  path: string
}

// function needMergeOption(targetOption: WebpackOption): WebpackOption {
//   return function(defaultOption: WebpackOption) {
//     if(!targetOption) {
//       return defaultOption
//     } else {
//       return merge.smart(defaultOption, targetOption) 
//     }
//   }
// }

function dllOption(option: DllWebpackOption, webpackOption?: WebpackOption): WebpackOption {
  const { entry, path } = option

  const dllDirPath: string = resolve(path)
  const dllManifestPath: string = resolve(dllDirPath, '[name]-manifest.json')

  return {
    entry: entry,
    output: {
      path: dllDirPath,
      filename: '[name].js',
      library: '[name]'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new DllPlugin({
        path: dllManifestPath,
        name: '[name]'
      })
    ]
  }
}

export default dllOption
