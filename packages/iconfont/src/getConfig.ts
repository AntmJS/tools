/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path'
import fs from 'fs'
import colors from 'colors'

const defaultConfig = {
  symbol_url: '请参考README.md，复制官网提供的JS链接。如果提供了local_svgs，则url选填',
  use_typescript: true,
  save_dir: './src/components/icon/iconfont',
  save_style_file: './src/iconfont.scss',
  style_font_family: 'iconfont',
  trim_icon_prefix: 'icon',
  default_icon_size: 24,
}

export interface Config {
  symbol_url: string
  use_typescript: boolean
  save_dir: string
  save_style_file: string
  style_font_family: string
  trim_icon_prefix: string
  default_icon_size: number
}

let cacheConfig: Config

export default (rn: boolean, url?: string, output?: string, fontFamily?: string) => {
  if (cacheConfig) {
    return cacheConfig
  }

  const targetFile = path.resolve('iconfont.json')
  defaultConfig.save_style_file = output || defaultConfig.save_style_file
  defaultConfig.style_font_family = fontFamily || defaultConfig.style_font_family

  if (!fs.existsSync(targetFile)) {
    if (!rn && url) {
      defaultConfig.symbol_url = url
      return defaultConfig
    }
    if (rn && url) {
      defaultConfig.symbol_url = url.replace('.css', '.js')
      return defaultConfig
    }
    console.warn(colors.red('"iconfont.json" 文件不存在，请添加文件'))
    process.exit(1)
  }

  const config = require(targetFile) as Config

  if (!config.symbol_url || !/^(?:https?:)?\/\//.test(config.symbol_url)) {
    console.warn(colors.red('请在"iconfont.json" 文件中添加 symbol_url 字段'))
    process.exit(1)
  }

  if (config.symbol_url && config.symbol_url.indexOf('//') === 0) {
    config.symbol_url = 'http:' + config.symbol_url
  }

  if (config.symbol_url.indexOf('//') === 0) {
    config.symbol_url = 'https:' + config.symbol_url
  } else if (config.symbol_url.indexOf('http:') === 0) {
    config.symbol_url = config.symbol_url.replace('http:', 'https:')
  }

  cacheConfig = {...defaultConfig, ...config}

  return cacheConfig
}
