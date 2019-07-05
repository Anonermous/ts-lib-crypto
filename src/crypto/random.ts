import { TBytes, TRandomTypesMap } from './interface'
import { seedWordsList } from './seed-words-list'


const _random = (count: number) => {
  if (isBrowser) {
    const arr = new Uint8Array(count)
    const crypto = ((global as any).crypto || (global as any).msCrypto)
    crypto.getRandomValues(arr)
    return arr
  }

  const crypto = require('crypto')
  return Uint8Array.from(crypto.randomBytes(count))
}

const ensureBuffer = () => {
  try { const b = new Buffer(1) } catch (e) {
    throw new Error('Buffer not supported in this environment. Use Node.js or Browserify for browser support.')
  }
}

const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]'

export const random = <T extends keyof TRandomTypesMap>(count: number, type: T): TRandomTypesMap[T] => {
  switch (type) {
    case 'Array8':
      return Array.from(_random(count)) as TRandomTypesMap[T]
    case 'Array16':
      return Array.from(random(count, 'Uint16Array')) as TRandomTypesMap[T]
    case 'Array32':
      return Array.from(random(count, 'Uint32Array')) as TRandomTypesMap[T]
    case 'Buffer':
      ensureBuffer()
      return Buffer.from(_random(count)) as TRandomTypesMap[T]
    case 'Uint8Array':
      return _random(count) as TRandomTypesMap[T]
    case 'Uint16Array':
      return new Uint16Array(count)
        .map(_ => _random(2).reduce((a, b, i) => a | b << 8 * (1 - i), 0)) as TRandomTypesMap[T]
    case 'Uint32Array':
      return new Uint32Array(count)
        .map(_ => _random(4).reduce((a, b, i) => a | b << 8 * (1 - i), 0)) as TRandomTypesMap[T]
    default:
      throw new Error(type + ' is unsupported.')
  }
}

export const randomBytes = (length: number): TBytes =>
  random(length, 'Uint8Array')

export const randomSeed = (wordsCount: number = 15): string =>
  random(wordsCount, 'Array32')
    .map(x => seedWordsList[x % seedWordsList.length])
    .join(' ')

