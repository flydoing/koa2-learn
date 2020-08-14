export default {
  inserted(el, { value }, vnode) {
    el.onmousedown = ev => {
      if (value && value.targetClass && ev.target.className.indexOf(value.targetClass) < 0) {
        return
      }
      let x = ev.clientX - el.offsetLeft
      let y = ev.clientY - el.offsetTop

      document.onmousemove = ev => {
        ev.cancelBubble = true
        let l = ev.clientX - x
        let t = ev.clientY - y
        el.style.left = `${l}px`
        el.style.top = `${t}px`
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
