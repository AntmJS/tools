import dayjs from 'dayjs'
import bigjs from 'big.js'

type Record<K extends keyof any, T> = {
  [P in K]: T
}
type IAnyObject = Record<string, any>

/**
 * @description [lodash]创建一个防抖函数，它会延迟调用提供的函数，直到距离上次调用已过去 debounceMs 毫秒为止
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 * @export
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 */
declare function debounce(
  func: any,
  wait?: number,
  options?: {leading?: boolean; maxWait?: number; trailing?: boolean},
): any

/**
 * @description [lodash]创建一个节流函数，每隔 throttleMs 毫秒最多调用一次提供的函数
 * @supported all
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', throttle(updatePosition, 100))
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * const throttled = throttle(renewToken, 300000, { 'trailing': false })
 * jQuery(element).on('click', throttled)
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel)
 * @export
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0]
 *  The number of milliseconds to throttle invocations to; if omitted,
 *  `requestAnimationFrame` is used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 */
declare function throttle(
  func: any,
  wait?: number,
  options?: {leading?: boolean; maxWait?: number; trailing?: boolean},
): any

/**
 * @description 深度相等比较
 * @supported all
 * @example
 * ```tsx
 * const bool = isEqual({a: 1}, {a: 1})
 * ```
 * @export
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
declare function isEqual(a: any, b: any): boolean

/**
 * @description 判断是否是字符串类型
 * @supported all
 * @example
 * ```tsx
 * const bool = isString(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isString(args: any): boolean

/**
 * @description 判断是否是数组类型
 * @supported all
 * @example
 * ```tsx
 * const bool = isArray(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isArray(args: any): boolean

/**
 * @description 判断是否是布偶类型
 * @supported all
 * @example
 * ```tsx
 * const bool = isBoolean(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isBoolean(args: any): boolean

/**
 * @description 判断是否是undefined
 * @supported all
 * @example
 * ```tsx
 * const bool = isUndefined(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isUndefined(args: any): boolean

/**
 * @description 判断是否是null
 * @supported all
 * @example
 * ```tsx
 * const bool = isNull(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isNull(args: any): boolean

/**
 * @description 判断是否是数字类型
 * @supported all
 * @example
 * ```tsx
 * const bool = isNumber(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isNumber(args: any): boolean

/**
 * @description 判断是否是对象
 * @supported all
 * @example
 * ```tsx
 * const bool = isObject(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isObject(args: any): boolean

/**
 * @description 判断是否是空对象
 * @supported all
 * @example
 * ```tsx
 * const bool = isEmptyObject(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isEmptyObject(args: any): boolean

/**
 * @description 判断是否是方法
 * @supported all
 * @example
 * ```tsx
 * const bool = isFunction(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isFunction(args: any): boolean

/**
 * @description 判断是否是symbol
 * @supported all
 * @example
 * ```tsx
 * const bool = isSymbol(xxx)
 * ```
 * @export
 * @param {any} args
 * @returns {boolean}
 */
declare function isSymbol(args: any): boolean

/**
 * @description decode对象内的所有属性值
 * @supported all
 * @example
 * ```tsx
 * const obj = decodeParams({})
 * ```
 * @export
 * @param {IAnyObject} params
 * @return {*}  {IAnyObject}
 */
declare function decodeParams(params: IAnyObject): IAnyObject

/**
 * @description encode对象内的所有属性值
 * @supported all
 * @example
 * ```tsx
 * const obj = encodeParams({})
 * ```
 * @export
 * @param {IAnyObject} params
 * @return {*}  {IAnyObject}
 */
declare function encodeParams(params: IAnyObject): IAnyObject

/**
 * @description 传入不带问号的search返回对象，解析query成对象
 * @supported all
 * @example
 * ```tsx
 * const obj = parse('')
 * ```
 * @export
 * @param {string} str
 * @param {boolean} decode
 * @return {*}  {IAnyObject}
 */
declare function parse(str: string, decode?: boolean): IAnyObject

/**
 * @description 传入一个对象返回&拼接的字符串，对象解析成字符串以&拼接
 * @supported all
 * @example
 * ```tsx
 * const str = stringify({})
 * ```
 * @export
 * @param {IAnyObject} obj
 * @param {boolean} encode
 * @return {*}  {string}
 */
declare function stringify(obj: IAnyObject, encode?: boolean): string

/**
 * @description 比较版本号大小
 * @param {string} ver1
 * @param {string} ver2
 * @returns {number}
 */
declare function version(ver1: string, ver2: string): number

declare function isMobile(args: string): boolean

declare function isIDCard(args: string): boolean
declare function isBankCard(args: string): boolean
declare function isEmail(args: string): boolean

declare function randomNum(min: number, max: number): number

declare function randomStr(length: number): string

/**
 * @description 格式化数字
 * @param {number | string} value
 * @param {number} decimal
 * @returns {string}
 */
declare function formatDigit(value, decimal?: number): string | null | undefined
declare function loopFunc(
  func: () => Promise<boolean>,
  ms?: number,
  times?: number,
): {start: () => void; stop: () => void}

declare function formatNumber(value): string | null | undefined

declare function sleep(time: number): Promise<any>
declare function sizeOfStr(str: string): number

/**
 * 格式化日期
 * @param {string} format - 日期格式化字符串，例如 "YYYY-MM-DD"
 * @param {string|number|Date|dayjs.Dayjs} [date=undefined] - 日期值，可以是字符串、Unix 时间戳、Date 对象或 dayjs 对象
 * @returns {string} 格式化后的日期字符串
 */
declare function formatDate(format: string, date?: string | number | Date | dayjs.Dayjs): string
declare function formatStartUnix(date?: dayjs.Dayjs | number): string
declare function formatStartDay(date?: dayjs.Dayjs | number): string

declare function filterUndefinedAndNull(obj: any): any
declare function compareVersion(ver1: string): {
  isBefore: (ver2: string) => boolean
  isAfter: (ver2: string) => boolean
  isSame: (ver2: string) => boolean
}

export {
  debounce,
  throttle,
  version,
  stringify,
  parse,
  decodeParams,
  encodeParams,
  isEqual,
  isString,
  isArray,
  isBoolean,
  isEmptyObject,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isSymbol,
  isUndefined,
  isMobile,
  isIDCard,
  isBankCard,
  isEmail,
  randomNum,
  randomStr,
  formatDigit,
  formatNumber,
  sleep,
  formatDate,
  formatStartUnix,
  formatStartDay,
  filterUndefinedAndNull,
  compareVersion,
  sizeOfStr,
  loopFunc,
  dayjs,
  bigjs,
}
