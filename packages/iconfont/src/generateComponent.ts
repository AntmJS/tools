import fs from 'fs'
import path from 'path'
import * as mkdirp from 'mkdirp'
import * as glob from 'glob'
import colors from 'colors'
import camelCase from 'lodash.camelcase'
import upperFirst from 'lodash.upperfirst'
import {XmlData} from 'iconfont-parser'
import {Config} from './getConfig'
import {getTemplate} from './getTemplate'
import {
  replaceCases,
  replaceComponentName,
  replaceImports,
  replaceExports,
  replaceNames,
  replaceNamesArray,
  replaceSingleIconContent,
  replaceSize,
  replaceSvgComponents,
  replaceHelper,
} from './replace'
import {whitespace} from './whitespace'
import {copyTemplate} from './copyTemplate'

const SVG_MAP = {
  path: 'Path',
}

const ATTRIBUTE_FILL_MAP = ['path']

export const generateComponent = (data: XmlData, config: Config) => {
  const svgComponents = new Set<string>()
  const names: string[] = []
  const imports: string[] = []
  const saveDir = path.resolve(config.components, 'iconfont')
  const jsxExtension = config.typescript ? '.tsx' : '.js'
  const jsExtension = config.typescript ? '.ts' : '.js'
  let cases = ''
  mkdirp.sync(saveDir)
  glob.sync(path.join(saveDir, '*')).forEach(file => fs.unlinkSync(file))

  if (config.typescript) {
    svgComponents.add('GProps')
  }

  copyTemplate(`helper${jsExtension}`, path.join(saveDir, `helper${jsExtension}`))
  if (!config.typescript) {
    copyTemplate('helper.d.ts', path.join(saveDir, 'helper.d.ts'))
  }

  data.svg.symbol.forEach((item, index) => {
    let singleFile: string
    const currentSvgComponents = new Set<string>(['Svg'])
    const iconId = item.$.id
    const iconIdAfterTrim = config.fontClassPrefix
      ? iconId.replace(new RegExp(`^${config.fontClassPrefix}(.+?)$`), (_, value) =>
          value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'),
        )
      : iconId
    const componentName = upperFirst(camelCase(iconId))

    names.push(iconIdAfterTrim)

    if (config.typescript) {
      currentSvgComponents.add('GProps')
    }

    for (const domName of Object.keys(item)) {
      switch (domName) {
        case 'path':
          currentSvgComponents.add('Path')
          break
        default:
        // no default
      }
    }

    cases += `${whitespace(4)}case '${iconIdAfterTrim}':\n`

    imports.push(componentName)
    cases += `${whitespace(6)}return <${componentName} key="${index + 1}" {...rest} />;\n`

    singleFile = getTemplate('SingleIcon' + jsxExtension)
    singleFile = replaceSize(singleFile, 24)
    singleFile = replaceSvgComponents(singleFile, currentSvgComponents)
    singleFile = replaceComponentName(singleFile, componentName)
    singleFile = replaceSingleIconContent(singleFile, generateCase(item, 4))
    singleFile = replaceHelper(singleFile)

    fs.writeFileSync(path.join(saveDir, componentName + jsxExtension), singleFile)

    if (!config.typescript) {
      let typeDefinitionFile = getTemplate('SingleIcon.d.ts')

      typeDefinitionFile = replaceComponentName(typeDefinitionFile, componentName)
      fs.writeFileSync(path.join(saveDir, componentName + '.d.ts'), typeDefinitionFile)
    }

    console.log(`${colors.green('√')} Generated icon "${colors.yellow(iconId)}"`)
  })

  let iconFile = getTemplate('Icon' + jsxExtension)

  iconFile = replaceSize(iconFile, 24)
  iconFile = replaceCases(iconFile, cases)
  iconFile = replaceSvgComponents(iconFile, svgComponents)
  iconFile = replaceImports(iconFile, imports)
  iconFile = replaceExports(iconFile, imports)

  if (config.typescript) {
    iconFile = replaceNames(iconFile, names)
  } else {
    iconFile = replaceNamesArray(iconFile, names)

    let typeDefinitionFile = getTemplate('Icon.d.ts')

    typeDefinitionFile = replaceExports(typeDefinitionFile, imports)
    typeDefinitionFile = replaceNames(typeDefinitionFile, names)
    fs.writeFileSync(path.join(saveDir, 'index.d.ts'), typeDefinitionFile)
  }

  fs.writeFileSync(path.join(saveDir, 'index' + jsxExtension), iconFile)

  console.log(`\n${colors.green('√')} All icons have putted into dir: ${colors.green(saveDir)}\n`)
}

const generateCase = (data: XmlData['svg']['symbol'][number], baseIdent: number) => {
  let template = `\n${whitespace(baseIdent)}<Svg viewBox="${data.$.viewBox}" width={size} height={size} {...rest}>\n`

  for (const domName of Object.keys(data)) {
    const realDomName = SVG_MAP[domName]

    if (domName === '$') {
      continue
    }

    if (!realDomName) {
      console.error(colors.red(`Unable to transform dom "${domName}"`))
      process.exit(1)
    }

    const counter = {
      colorIndex: 0,
      baseIdent,
    }

    if (data[domName].$) {
      template += `${whitespace(baseIdent + 2)}<${realDomName}${addAttribute(domName, data[domName], counter)}\n${whitespace(baseIdent + 2)}/>\n`
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach(sub => {
        template += `${whitespace(baseIdent + 2)}<${realDomName}${addAttribute(domName, sub, counter)}\n${whitespace(baseIdent + 2)}/>\n`
      })
    }
  }

  template += `${whitespace(baseIdent)}</Svg>\n`

  return template
}

const addAttribute = (
  domName: string,
  sub: XmlData['svg']['symbol'][number]['path'][number],
  counter: {colorIndex: number; baseIdent: number},
) => {
  let template = ''

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      // Set default color same as in iconfont.cn
      // And create placeholder to inject color by user's behavior
      sub.$.fill = sub.$.fill || '#333333'
    }

    for (const attributeName of Object.keys(sub.$)) {
      if (attributeName === 'fill') {
        template += `\n${whitespace(counter.baseIdent + 4)}${attributeName}={getIconColor(color, ${counter.colorIndex}, '${sub.$[attributeName]}')}`
        counter.colorIndex += 1
      } else {
        template += `\n${whitespace(counter.baseIdent + 4)}${camelCase(attributeName)}="${sub.$[attributeName]}"`
      }
    }
  }

  return template
}
