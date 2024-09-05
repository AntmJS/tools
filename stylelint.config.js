// stylelint rule https://stylelint.io/user-guide/rules/selector-max-attribute
// https://cloud.tencent.com/developer/section/1489630

// 'function-url-no-scheme-relative': null, // --禁止使用相对协议的链接

module.exports = {
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard', 'stylelint-config-taro-rn'],
  rules: {
    'selector-max-id': 0, // 限制选择器中ID选择器的数量#a{}'
    'selector-max-type': 0, // 限制选择器中的类型数a{}'
    'selector-max-attribute': 0, // 限制选择器中属性选择器的数量[name="xxx"]{}'
    'color-named': 'never',
    'color-hex-length': 'long', // 指定十六进制颜色是否使用缩写"short"|"long"
    'color-no-invalid-hex': true, // 禁止使用无效的十六进制颜色
    'comment-no-empty': true, // 禁止空注释
    'declaration-block-no-duplicate-properties': true, // 禁止在声明块中使用重复的属性
    'declaration-block-no-shorthand-property-overrides': true, // 禁止缩写属性覆盖相关普通写法属性
    'font-family-name-quotes': 'always-where-recommended', // --指定字体名称是否需要使用引号引起来
    'font-family-no-duplicate-names': true, // 禁止使用重复的字体名称
    'font-family-no-missing-generic-family-keyword': true, // 不允许移除通用的字体
    'font-weight-notation': 'named-where-possible', // --要求使用数字或命名的 (可能的情况下) font-weight 值
    'function-calc-no-unspaced-operator': true, // 禁止在 calc 函数内使用不加空格的操作符
    'function-linear-gradient-no-nonstandard-direction': true, // 根据标准语法，禁止 linear-gradient() 中无效的方向值
    'function-url-quotes': 'always', // --要求或禁止 url 使用引号
    'function-no-unknown': null,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'keyframe-declaration-no-important': true, // 禁止在 keyframe 声明中使用 !important
    'media-feature-name-no-unknown': true, // 禁止使用未知的 media 特性名称
    'no-duplicate-at-import-rules': true, // 禁止重复的@import
    'no-duplicate-selectors': true, // 在一个样式表中禁止出现重复的选择器
    'no-empty-source': null, // 不允许空文件
    'no-invalid-double-slash-comments': true, // 禁用 CSS 不支持的双斜线注释
    'selector-attribute-quotes': 'always', // --要求或禁止特性值使用引号
    'string-no-newline': true, // 禁止在字符串中使用（非转义的）换行符
    // 以下规则为升级 stylelint 到 14 版本后添加
    // 允许选择器带浏览器前缀，如 -moz-
    'selector-no-vendor-prefix': null,
    // 类名命名规则
    'selector-class-pattern': null,
    'selector-max-combinators': null,
    'taro-rn/line-height-no-value-without-unit': null,
    'at-rule-no-unknown': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'import-notation': 'string',
  },
}
