const {ipcRenderer: ipc} = require('electron');
const Store = require("electron-store");

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
window.addEventListener('DOMContentLoaded', () => {
  let store = new Store();
  if (!store.get('radius')) {
    const schema = {
      radius: {type: 'number', default: 150},
      opacity: {type: 'number', default: 0.7},
      lineColor1: {type: 'string', default: '#ffffff'},
      lineColor2: {type: 'string', default: '#1ae721'}
    }
    store = new Store({schema});
  }
  if (process.platform !== 'darwin') {
    document.getElementById('mac-op').remove()
  } else {
    document.getElementById('windows-op').remove()
  }

  document.getElementById('btn_close').addEventListener('click', ()=> {
    ipc.send('close');
  })
  document.getElementById('btn_min').addEventListener('click', ()=> {
    ipc.send('min');
  })
  document.getElementById('btn_max')?.addEventListener('click', ()=> {
    ipc.send('max');
  })

  // 圆半径
  const value = document.querySelector("#value")
  const input = document.querySelector("#radiusInput")
  input.value = store.get('radius') || 150
  value.textContent = input.value
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value
    store.set('radius', Number(event.target.value))
  })

  // 透明度
  const opacityValue = document.querySelector("#opacityValue")
  const opacityInput = document.querySelector("#opacity")
  opacityInput.value = store.get('opacity') || 0.7
  opacityValue.textContent = opacityInput.value

  opacityInput.addEventListener("input", (event) => {
    opacityValue.textContent = event.target.value
    if (event.target.value !== '') {
      store.set('opacity', Number(event.target.value))
    }
  })


  // 横线竖线颜色
  const inputColor1 = document.querySelector("#inputColor1")
  inputColor1.value = store.get('lineColor1') || '#ffffff'
  const inputColor2 = document.querySelector("#inputColor2")
  inputColor2.value = store.get('lineColor2') || '#1ae721'

  inputColor1.addEventListener("input", (event) => {

    if (event.target.value) {
      store.set('lineColor1', event.target.value)
    }

  })
  inputColor2.addEventListener("input", (event) => {
    if (event.target.value) {
      store.set('lineColor2', event.target.value)
    }

  })

  // 线长度比例
  const lineRadioValue = document.querySelector("#lineRadioValue")
  const inputLineRadio = document.querySelector("#inputLineRadio")
  inputLineRadio.value = store.get('lineRadio') || 100
  lineRadioValue.textContent = inputLineRadio.value
  inputLineRadio.addEventListener("input", (event) => {
    if (event.target.value) {
      store.set('lineRadio', Number(event.target.value))
      lineRadioValue.textContent = event.target.value
    }
  })

  // 小圆比例
  const innerCircleRadiovalue = document.querySelector("#innerCircleRadiovalue")
  const inputInnerCircleRadio = document.querySelector("#inputInnerCircleRadio")
  inputInnerCircleRadio.value = store.get('innerCircleRadio') || 15
  innerCircleRadiovalue.textContent = inputInnerCircleRadio.value
  inputInnerCircleRadio.addEventListener("input", (event) => {
    if (event.target.value) {
      store.set('innerCircleRadio', Number(event.target.value))
      innerCircleRadiovalue.textContent = event.target.value
    }
  })


  // 小圆颜色
  const innerCircleColor = document.querySelector("#innerCircleColor")
  innerCircleColor.value = store.get('innerCircleColor') || '#ffffff'
  innerCircleColor.addEventListener("input", (event) => {
    if (event.target.value) {
      store.set('innerCircleColor', event.target.value)
    }
  })

})
