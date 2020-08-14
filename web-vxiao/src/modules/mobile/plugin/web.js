export default {
  name: 'WebClient',
  events: {},
  listen(type, handle) {
    this.events[type] = handle
  },
  /**
   * 客户端主动发起调用html5
   * @return {[type]} [description]
   */
  jsAction(data) {},
  /**
   * 客户端主动发起调用html5
   * @return {[type]} [description]
   */
  postAction(data) {
    this.jsAction(data)
  },
  /**
   * html5 主动发起调用客户端事件
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  postJsAction(data) {
    // if (data.type === Cammand.ACTION_TITLE) {
    //   document.title = data.content
    // }
    // 注册监听
    this.listen(data.type, data.handle)
    try {
      if (/android/i.test(navigator.userAgent)) {
        window.jsObj.postJsAction(JSON.stringify(data))
      } else if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        if (/AppleWebKit/.test(navigator.userAgent)) {
          window.parent.postJsAction && window.parent.postJsAction(JSON.stringify(data))
        } else if (/AppWebKit/.test(navigator.userAgent)) {
          window.webkit.messageHandlers.postJsAction.postMessage({
            body: JSON.stringify(data)
          })
        }
      } else {
        window.parent.postJsAction && window.parent.postJsAction(JSON.stringify(data))
      }
    } catch (e) {
      console.log(`[Error Message]：${e.message}`)
    }
  }
}
