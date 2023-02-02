const value = document.querySelector("#value")
const input = document.querySelector("#radiusInput")
value.textContent = input.value


const opacityValue = document.querySelector("#opacityValue")
const opacityInput = document.querySelector("#opacity")
opacityValue.textContent = opacityInput.value

const inputColor1 = document.querySelector("#inputColor1")
const inputColor2 = document.querySelector("#inputColor2")

input.addEventListener("input", (event) => {
  radius = Number(event.target.value)
  changeRadius()
  value.textContent = event.target.value

})

opacityInput.addEventListener("input", (event) => {
  opacityValue.textContent = event.target.value
  if (event.target.value !== '') {
    let _dragEle = document.querySelector('.measure-angle')
    _dragEle.style.border = `46px solid rgba(255, 255, 255, ${event.target.value})`
  }

})

inputColor1.addEventListener("input", (event) => {
  if (event.target.value) {
    changeLineColor(event.target.value)
  }

})
inputColor2.addEventListener("input", (event) => {
  if (event.target.value) {
    changeLineColor2(event.target.value)
  }
})

// const inputAngle = document.querySelector("#inputAngle")
inputAngle.value = curAngle
setWrapWidth()
let _line90 = document.querySelector('.line_90')
let _line270 = document.querySelector('.line_270')
inputAngle.addEventListener("input", (event) => {
  setLinePositionByAngle({ curEle: _line90, oppositeEle: _line270, deg: Number(event.target.value) })
  setWrapWidth()
})
inputAngle.addEventListener("blur", (event) => {
  if (event.target.value === '') {
    inputAngle.value = 0
  }
})
let btn_expand = document.getElementById('btn_expand')
let settingPanelContent = document.querySelector('.setting-pannel-content')
btn_expand.addEventListener('click', function () {
  const expand = settingPanelContent.getAttribute('expand')
  if (expand) {
    settingPanelContent.setAttribute('expand', '')
    settingPanelContent.style.display = 'block'
    btn_expand.querySelector('em').style.transform = 'rotate(-180deg)'

  } else {
    settingPanelContent.setAttribute('expand', 'true')
    settingPanelContent.style.display = 'none'
    btn_expand.querySelector('em').style.transform = ''
  }
})
