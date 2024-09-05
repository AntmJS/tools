#!/usr/bin/env node

import {fetchXml} from 'iconfont-parser'
import colors from 'colors'
import getConfig from './getConfig'
import {generateComponent} from './generateComponent'
import {getTemplate} from './getTemplate'

/* eslint-disable @typescript-eslint/no-require-imports */

const npath = require('path')
const https = require('https')
const fs = require('fs')

function accMul(arg1, arg2) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    const sp = s1.split('.')
    if (sp.length > 1) {
      m += s1.split('.')[1].length
    }
  } catch (e) {
    console.error(e)
  }

  try {
    const sp = s1.split('.')
    if (sp.length > 1) {
      m += s2.split('.')[1].length
    }
  } catch (e) {
    console.error(e)
  }

  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

function grabConfigFromScript(str, n) {
  const stash: string[] = []
  let rst = ''
  for (let i = n, l = str.length; i < l; i++) {
    if (str[i] === '{') {
      stash.push('{')
    }

    if (str[i] === '}') {
      stash.pop()
      if (stash.length === 0) {
        rst += '}'
        break
      }
    }

    if (stash.length) {
      rst += str[i]
    }
  }

  return rst
}

function transform(rn) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    const config = getConfig()
    if (rn) {
      try {
        const result = await fetchXml(config.src)
        generateComponent(result, config)
        const jsxExtension = config.typescript ? '.tsx' : '.js'
        let componentFile = getTemplate('index.rn' + jsxExtension)
        componentFile = componentFile.replace('#class#', config.fontFamily)
        componentFile = componentFile.replace('#prefix#', config.fontClassPrefix)
        componentFile = componentFile.replace('#size#', String(config.defaultSize))
        componentFile = componentFile.replace('#color#', config.defaultColor)
        fs.writeFileSync(npath.join(config.components, 'index.rn' + jsxExtension), componentFile)
      } catch (error: any) {
        console.error(colors.red(error?.message || 'Unknown Error'))
        process.exit(1)
      }
    }
    https.get(config.src?.replace('.js', '.css'), res => {
      let content = ''
      res.on('error', e => {
        reject(e)
      })
      res.on('data', chunk => {
        content += chunk
      })
      res.on('end', () => {
        const match = content.match(new RegExp('[\\s\\r\\n]*@font-face[\\s\\r\\n]*'))
        const nmatch = match ? match[0] : undefined
        const replaceContent = nmatch
          ? grabConfigFromScript(content, content.indexOf(nmatch) + nmatch.length)
          : ''
        replaceContent.replace(/url\(['"]([\s\S]+?)['"]\)/, (c, url) => {
          if (url.indexOf('//') === 0) {
            url = `https:${url}`
          } else if (url.indexOf('http:') === 0) {
            url = url.replace('http:', 'https:')
          }
          url = `${url.substr(0, url.lastIndexOf('.'))}.ttf?t=${Date.now()}`
          https.get(url, res => {
            const chunks: any = []
            res.on('error', e => {
              reject(e)
            })
            res.on('data', chunk => {
              chunks.push(chunk)
            })
            res.on('end', () => {
              const base64 = Buffer.concat(chunks).toString('base64')
              let font = `{font-family: '${config.fontFamily}';src: url(data:font/truetype;charset=utf-8;base64,#BASE64) format('truetype');font-weight: normal;font-style: normal;}`
              font = font.replace('#BASE64', base64)
              content = content.replace(replaceContent, font)
              content = content.replace(/(\d+(\.{0,1}\d+){0,1})px/, (a, b) => {
                return a.replace(a, `${accMul(b, 2)}px`)
              })
              fs.writeFileSync(npath.resolve(config.style), content)
              // 写入组件
              const jsxExtension = config.typescript ? '.tsx' : '.js'
              let componentFile = getTemplate('index' + jsxExtension)
              componentFile = componentFile.replace('#class#', config.fontFamily)
              componentFile = componentFile.replace('#prefix#', config.fontClassPrefix)
              componentFile = componentFile.replace('#size#', String(config.defaultSize))
              componentFile = componentFile.replace('#color#', config.defaultColor)
              fs.writeFileSync(npath.join(config.components, 'index' + jsxExtension), componentFile)
              resolve(null)
            })
          })
          return c
        })
      })
    })
  })
}
async function start(rn) {
  try {
    await transform(rn)
    console.info('转换成功')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

let rn = true

process.argv.forEach((val, index) => {
  if (val === '--no-rn') {
    rn = false
  }
})

start(rn)
