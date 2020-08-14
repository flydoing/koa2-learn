const crypto = require('crypto')
const iv = 'vxiao123'
const keyPrefix = 'mashang??..'
export default {
  // 加密
  encrypt(word, key) {
    let cipher = crypto.createCipheriv('des-ede3-cbc', `${keyPrefix}${key}`, iv)
    cipher.setAutoPadding(true)
    let value = cipher.update(word, 'utf8', 'hex')
    value += cipher.final('hex')
    return value
  },
  // 解密
  decrypt(code, key) {
    let decipher = crypto.createDecipheriv('des-ede3-cbc', `${keyPrefix}${key}`, iv)
    decipher.setAutoPadding(true)
    let value = decipher.update(code, 'hex', 'utf8')
    value += decipher.final('utf8')
    return value
  }
}
