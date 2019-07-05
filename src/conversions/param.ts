import { TBinaryIn, TBytes, TRawStringIn, TRawStringInDiscriminator } from '../crypto/interface'
import * as CryptoJS from 'crypto-js'
import { base58Decode } from './base-xx'
import { stringToBytes } from './string-bytes'

const isString = (val:any): val is string => typeof val === 'string' || val instanceof String
const isUint8Array = (val: any): val is Uint8Array => val instanceof Uint8Array

const isTRawStringInDiscriminator = (_: TRawStringIn): _ is TRawStringInDiscriminator => false

export const _fromIn = (inValue: TBinaryIn): TBytes => {
  if (isString(inValue))
    return base58Decode(inValue)

  if (isUint8Array(inValue))
    return inValue

  return Uint8Array.from(inValue)
}

export const _fromRawIn = (inValue: TRawStringIn): TBytes => {
  if (isTRawStringInDiscriminator(inValue))
    throw new Error('')

  if (isString(inValue))
    return stringToBytes(inValue)

  if (isUint8Array(inValue))
    return inValue

  return Uint8Array.from(inValue)
}

export const _toWords = (arr: Uint8Array) => {
  const len = arr.length
  const words: any = []
  for (let i = 0; i < len; i++) {
    words[i >>> 2] |= (arr[i] & 0xff) << (24 - (i % 4) * 8)
  }
  return (CryptoJS.lib.WordArray.create as any)(words, len)
}

export const _fromWords = (inValue: any): TBytes => {
  let words = (<any>inValue).words
  let sigBytes = (<any>inValue).sigBytes

  let u8 = new Uint8Array(sigBytes)
  for (let i = 0; i < sigBytes; i++) {
    let byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    u8[i] = byte
  }

  return u8
}