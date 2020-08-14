import Transcode from '@/utils/transcode'
import Check from '@/utils/check'
export default class Channal {
  url = ''
  ws = null
  timeout = null
  time = 30000
  constructor(url, account, tokenId, clientId, listen = () => {}) {
    this.url = url
    this.account = account
    this.tokenId = tokenId
    this.clientId = clientId
    this.listen = listen
    this.isQuit = false
  }
  connect() {
    if (!('WebSocket' in window) && !('MozWebSocket' in window)) {
      return false
    }
    if ('MozWebSocket' in window) {
      this.ws = new window.MozWebSocket(this.url)
    } else {
      this.ws = new WebSocket(this.url)
    }
    this.ws.onopen = () => {
      this.heart()
      this.send({
        username: this.account,
        password: this.tokenId,
        clientId: this.clientId
      })
    }
    this.ws.onmessage = evt => {
      let redata = JSON.parse(evt.data)
      let decode = Transcode.decode(redata.payload)
      let content = Check.isJsonString(decode) ? JSON.parse(decode) : decode
      this.send({ content: redata.messageID })
      this.listen(content)
      this.heart() // 保持心跳
    }
    return this.ws
  }
  reconect() {
    this.isQuit = false
    this.connect()
  }
  send(data) {
    this.ws.send(JSON.stringify(data))
  }
  heart() {
    let that = this
    clearInterval(this.timeout)
    this.timeout = setInterval(() => {
      if (that.ws.readyState === that.ws.OPEN) {
        that.ws.send('@heart')
      } else if (that.ws.readyState === that.ws.CLOSED && !that.isQuit) {
        that.ws.close()
        that.ws = null
        that.reconect()
      }
    }, that.time)
  }
  close() {
    this.isQuit = true
    this.ws.close()
    clearInterval(this.timeout)
  }
}
