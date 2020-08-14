export default {
  bind(el, binding) {
    el.addEventListener('keypress', e => {
      e = e || window.event
      let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
      let re = /\d/

      if (binding.expression === '1') {
        if (charcode === 46) {
          if (el.value.includes('.')) {
            e.preventDefault()
          }
          return
        }
      }

      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
    el.addEventListener('keyup', e => {
      if (binding.expression === '1') {
        el.value = el.value.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      }
    })
  }
}
