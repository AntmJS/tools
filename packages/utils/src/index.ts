import isEqual from 'react-fast-compare'
import dayjs from 'dayjs'
import bigjs from 'big.js'

type Record<K extends keyof any, T> = {
  [P in K]: T
}
type IAnyObject = Record<string, any>

export {isEqual}

export function debounce(func, wait, options) {
  let lastArgs
  let lastThis
  let maxWait
  let result
  let timerId
  let lastCallTime
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function'

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, milliseconds) {
    if (useRAF) {
      window.cancelAnimationFrame(timerId)
      return window.requestAnimationFrame(pendingFunc)
    }

    return setTimeout(pendingFunc, milliseconds)
  }

  function cancelTimer(id) {
    if (useRAF) {
      window.cancelAnimationFrame(id)
      return
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
    return undefined
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}

export function compareVersion(ver1) {
  return {
    isBefore: ver2 => version(ver1, ver2) < 0,
    isAfter: ver2 => version(ver1, ver2) > 0,
    isSame: ver2 => version(ver1, ver2) == 0,
  }
}

export function version(ver1: string, ver2: string): number {
  const v1: string[] = ver1.split('.')
  const v2: string[] = ver2.split('.')
  const len: number = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }

  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1: number = v1[i] ? parseInt(v1[i]!) : 0
    const num2: number = v2[i] ? parseInt(v2[i]!) : 0

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

export function decodeParams(params: IAnyObject): IAnyObject {
  const newParams: IAnyObject = {}
  if (!isObject(params)) {
    return newParams
  }

  for (const key in params) {
    const kkey = decodeURIComponent(key)
    const vvalue = decodeURIComponent(params[key])
    if (isString(vvalue)) {
      try {
        newParams[kkey] = JSON.parse(vvalue)
        if (isNumber(newParams[kkey]) && newParams[kkey] + '' !== vvalue + '') {
          newParams[kkey] = vvalue
        }
      } catch (error) {
        newParams[kkey] = vvalue
      }
    } else {
      newParams[kkey] = vvalue
    }
  }

  return newParams
}

export function encodeParams(params: IAnyObject): IAnyObject {
  const newParams: IAnyObject = {}
  if (!isObject(params)) {
    return newParams
  }

  for (const key in params) {
    const kkey = encodeURIComponent(key)
    const vvalue = encodeURIComponent(params[key])
    newParams[kkey] = vvalue
  }

  return newParams
}

export function parse(str: string, decode = true): IAnyObject {
  const params: IAnyObject = {}
  if (!isString(str)) {
    return params
  }
  const trimStr: string = str.trim()
  if (trimStr === '') {
    return params
  }

  const newStr: string[] = trimStr.split('&')

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < newStr.length; i++) {
    const [key, value]: string[] = newStr[i]!.split('=')
    if (decode) {
      const kkey = decodeURIComponent(key!)
      const vvalue = decodeURIComponent(value!)
      if (isString(vvalue)) {
        try {
          params[kkey] = JSON.parse(vvalue)
          if (isNumber(params[kkey]) && params[kkey] + '' !== vvalue + '') {
            params[kkey] = vvalue
          }
        } catch (error) {
          params[kkey] = vvalue
        }
      } else {
        params[kkey] = vvalue
      }
    } else {
      params[key!] = value
    }
  }

  return params
}

export function stringify(obj: IAnyObject, encode = true): string {
  if (!isObject(obj)) {
    return ''
  }
  const str: string[] = []
  for (const key in obj) {
    let value = ''
    if (encode) {
      if (typeof obj[key] === 'object') {
        value = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(obj[key]))}`
      } else if (typeof obj[key] === 'undefined') {
        value = `${encodeURIComponent(key)}=undefined`
      } else {
        value = `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      }
    } else {
      value = `${key}=${obj[key]}`
    }
    str.push(value)
  }

  return str.join('&')
}

export function isString(args: any): boolean {
  return toString.call(args) === '[object String]'
}

export function isArray(args: any): boolean {
  return toString.call(args) === '[object Array]'
}

export function isBoolean(args: any): boolean {
  return toString.call(args) === '[object Boolean]'
}

export function isUndefined(args: any): boolean {
  return toString.call(args) === '[object Undefined]'
}

export function isNull(args: any): boolean {
  return toString.call(args) === '[object Null]'
}

export function isNumber(args: any): boolean {
  return toString.call(args) === '[object Number]'
}

export function isDecimal(args: any) {
  return Number.isFinite(args) && !Number.isInteger(args)
}

export function isObject(args: any): boolean {
  return toString.call(args) === '[object Object]'
}

export function isEmptyObject(args: any): boolean {
  if (!isObject(args)) {
    return false
  }

  for (const prop in args) {
    if (!isUndefined(args[prop])) {
      return false
    }
  }

  return true
}

export function isFunction(args: any): boolean {
  return toString.call(args) === '[object Function]'
}

export function isSymbol(args: any): boolean {
  return toString.call(args) === '[object Symbol]'
}

export function isMobile(args: string) {
  return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(args)
}

export function isIDCard(args: string) {
  return /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/.test(
    args,
  )
}
export function isBankCard(args: string) {
  return /^[1-9]\d{9,29}$/.test(args)
}
export function isEmail(args: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    args,
  )
}

export const sizeOfStr = function (str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g, 'aa').length
}

export function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function randomStr(length: number) {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomStr = ''

  for (let i = 0; i < length; i++) {
    randomStr += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
  }

  return randomStr
}

export function formatDigit(value: number | string, decimal = 0) {
  if (value === 0 || value === '0') return '0'
  if (!value) return value
  const str = value.toString().match(/((([1-9](\d+)?)|0)\.(\d+)?)|([1-9](\d+)?)/)?.[0] ?? ''
  if (decimal === 0) return str
  return str.match(/\d*(\.)?(\d{1,2})?/)?.[0] ?? ''
}

export function formatNumber(value) {
  if (value === 0 || value === '0') return '0'
  if (!value) return value
  return value.toString().match(/[1-9](\d+)?/)?.[0] ?? ''
}

export function formatDate(format: string, date?: string | number | Date | dayjs.Dayjs) {
  let dayjsDate: dayjs.Dayjs
  if (date && typeof date === 'number') {
    dayjsDate = dayjs.unix(date)
  } else {
    dayjsDate = date ? dayjs(date) : dayjs()
  }

  // 使用提供的格式化字符串格式化日期
  return dayjsDate.format(format)
}

export function formatStartUnix(date?: dayjs.Dayjs | number) {
  if (typeof date === 'number')
    return dayjs
      .unix(date)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .unix()
  if (!date) return date
  return date.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).unix()
}

export function formatStartDay(date?: dayjs.Dayjs | number) {
  if (typeof date === 'number')
    return dayjs.unix(date).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
  if (!date) return date
  return date.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
}

export function filterUndefinedAndNull(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  const result: any = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== undefined && value !== null) {
      result[key] = filterUndefinedAndNull(value)
    }
  })
  return result
}

export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export function loopFunc(
  func: () => Promise<boolean>,
  ms = 1000,
  times = 0,
): {start: () => void; stop: () => void} {
  let index = 0
  let stop = false
  async function _loop() {
    index++
    const continues = await func()
    if (!stop && continues && (times === 0 || index < times)) {
      if (ms !== 0) {
        await sleep(ms)
      }
      _loop()
    }
  }
  return {
    start() {
      _loop()
    },
    stop() {
      stop = true
    },
  }
}

export {dayjs, bigjs}
