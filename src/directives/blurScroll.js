import Vue from 'vue'
const resizeFn = () => {
  let oy = window.pageYOffset
  setTimeout(() => {
    window.scroll(0, oy + 2)
  }, 105)
}
Vue.directive('blurScroll', {
  bind: function (el) {
    if (el.localName === 'input' || el.localName === 'textarea') {
      el.addEventListener('blur', resizeFn)
    } else {
      const child = el.querySelector('input')
      child.addEventListener('blur', resizeFn)
    }
  },
  unbind: function (el) {
    if (el.localName === 'input' || el.localName === 'textarea') {
      el.removeEventListener('blur', resizeFn)
    } else {
      const child = el.querySelector('input')
      child.removeEventListener('blur', resizeFn)
    }
  }
})
