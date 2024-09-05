/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path'
import fs from 'fs'
import colors from 'colors'

const configPath = path.resolve(process.cwd(), './antm.config.js')

const defaultConfig = {
  src: '使用iconfont的Symbol链接，即//***.js',
  fontFamily: 'iconfont',
  fontClassPrefix: 'icon',
  typescript: true,
  components: './src/components/icon',
  style: './src/iconfont.scss',
}

export interface Config {
  src: string
  fontFamily: string
  fontClassPrefix: string
  typescript?: boolean
  components: string
  style: string
}

let cacheConfig: Config

export default (): Config => {
  if (cacheConfig) {
    return cacheConfig
  }

  if (fs.existsSync(configPath)) {
    const antmConfig: {iconfont: Config} = require(configPath)
    if (antmConfig.iconfont && typeof antmConfig.iconfont === 'object') {
      if (!antmConfig.iconfont.src || !/^(?:https?:)?\/\//.test(antmConfig.iconfont.src)) {
        console.warn(colors.red('请在"antm.config.js" 文件中添加 iconfont.src 字段'))
        process.exit(1)
      }

      if (antmConfig.iconfont.src && antmConfig.iconfont.src.indexOf('//') === 0) {
        antmConfig.iconfont.src = 'http:' + antmConfig.iconfont.src
      }

      if (antmConfig.iconfont.src.indexOf('//') === 0) {
        antmConfig.iconfont.src = 'https:' + antmConfig.iconfont.src
      } else if (antmConfig.iconfont.src.indexOf('http:') === 0) {
        antmConfig.iconfont.src = antmConfig.iconfont.src.replace('http:', 'https:')
      }

      cacheConfig = {...defaultConfig, ...antmConfig.iconfont}

      return cacheConfig
    } else {
      console.error('请检查antm.config.js文件的配置信息和README的要求是否一致')
      process.exit(1)
    }
  } else {
    console.error('根目录找不到antm.config.js文件')
    process.exit(1)
  }
}
