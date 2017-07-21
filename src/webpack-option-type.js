// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * webpack-option-type
 *
 * Define webpack option type.
 *
 * @return {WebpackOption}
 */

type WebpackOption = {
  entry: {
    [string]: Array<string> | string
  },
  output: {
    path: string,
    filename: string,
    chunkFilename: string,
    publicPath: string
  },
  module: {
    rules: Array<{
      test: RegExp,
      use: any
    }>
  },
  externals?: any,
  devServer?: {
    host: string,
    port: number,
    contentBase: string,
    publicPath: string,
    hot: boolean
  },
  plugins?: Array<any>
}

export default WebpackOption
