import moment from 'moment'
import * as Crypto from 'expo-crypto'

export class Helper {
  //Unique ID
  static generateUUID = () => {
    return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 13) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(13)
    })
  }

  //Currency formatter
  static currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  //Validation of inputs
  static validation = (type = null, value = null, offset = 2) => {
    type = type.toLowerCase()

    //Building switch for each case
    switch (type) {
      //Email
      case 'email':
        const patternEmail =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim

        if (patternEmail.test(value)) {
          return value
        }
        return false

      //Password
      case 'password':
        if (value !== null && value.length >= offset) {
          return value
        }
        return false

      //Text
      case 'text':
        if (
          typeof value !== 'undefined' &&
          value !== null &&
          value.length >= offset
        ) {
          return value
        }
        return false

      //Phone
      case 'phone':
        const patternPhone =
          /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
        const patternPhone2 =
          /^\s(?:\+?(\d{1,3}))?[-. (](\d{3})[-. )](\d{3})[-. ](\d{4})(?: x(\d+))?\s$/
        const patternPhone3 =
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
        const patternPhone4 =
          /\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/

        if (
          patternPhone.test(value) ||
          patternPhone2.test(value) ||
          patternPhone3.test(value) ||
          patternPhone4.test(value)
        ) {
          return value
        }
        return false

      //Date
      case 'date':
        if (moment(value).isValid()) {
          return value
        }

        return false

      default:
        return value
    }
  }

  //Random color
  static randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  //Sha-256 encryption
  static hash = async (value) => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      value
    )
  }
}
