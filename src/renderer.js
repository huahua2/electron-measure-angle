// 默认半径
let radius = 150
// 当前度数
let curAngle = 90
// 90°在下面，false在上面
const deg90InBottom = false

// 十字线长度比例 0%-100%
let lineRadio = 100
// 小圆比例（占大院内径的比例）
let innerCircleRadio = 15

// 外圈旋转度数
let outCircleRotate = 0
let moveCenter = {x: 0, y: 0}

// 92是边框的宽度
const BORDER_WIDTH = 92
// 1mm == 3.77px
const mmtoPX = 3.77

// 计算里面小圆的大小(暂时不用了，通过改变比例去算)
function calInnerCircle () {
  const WIDTH = radius * 2
  // 里面圆的边框是2px
  const innerCircleBorderWidth = 4
  // 计算外圆内径
  const innerCircleSizeMm = (WIDTH - BORDER_WIDTH) / mmtoPX
  // 每12mm内径，里面圆的直径是2mm
  const radio = innerCircleSizeMm / 12
  // 减掉边框2px
  return Number(radio * 2 * mmtoPX - innerCircleBorderWidth).toFixed(2)
}

// 计算操作线的长度
function calOplineLength () {
  const WIDTH = radius * 2
  const innerCircleSizeMm = (WIDTH - BORDER_WIDTH) / mmtoPX
  // 每12mm内径，线在圈内4mm
  const radio = innerCircleSizeMm / 12
  let totalLength = radio * 4 * mmtoPX
  if (lineRadio >= 0) {
    totalLength = totalLength * (lineRadio / 100)
  }
  // 圈边框是46，top22，那么线在圈内高度是24
  return Number(totalLength + 24).toFixed(0)
}

function radian2Angle(radian) {
  let deg = radian * (deg90InBottom ? 180 : -180) / Math.PI
  if (deg90InBottom) {
    deg -= outCircleRotate
  } else {
    deg += outCircleRotate
  }
  return Number(deg).toFixed(2)
}

const calcStateRotation = (rotation) => {
  rotation = rotation % 360

  if (rotation < 0) {
    rotation += 360
  }

  return Number(rotation).toFixed(2)
}
// 对角
const calOppositeAngle = (curDeg) => {
  let a = Number(curDeg) + 180
  if (a > 360) {
    a = a - 360
  }
  return Number(a).toFixed(2)
}

const calCssAngle = (angle, decimal = 2) => {
  const calDeg = deg90InBottom ? angle - 270 : 90 - angle
  return Number(calcStateRotation(calDeg)).toFixed(decimal)
}

const clear = () => {
  document.onmousemove = null
  document.onmouseup = null
}

function create() {
  const measureAngle = document.createElement('div');
  const style = document.createElement('style');

  let oLi = "";
  let sCss = "";

  for (let i = 0; i < 360; i++) {

    sCss += ".measure-angle li:nth-of-type(" + (i) + "){-webkit-transform: rotate(" + i * 1 + "deg);}";

    if ((i + 1) % 10 === 0) {
      const angleText = deg90InBottom ? i + 1 + 180 : i + 1
      oLi += "<li><em>" + calCssAngle(angleText, 0) + "</em></li>";
    } else {
      oLi += "<li></li>";
    }
  }

  measureAngle.innerHTML = '<div class="inner_circle"></div><div class="line_wrap"><div class="container">' + "<ul>" + oLi + '</ul><div class="line_0"></div><div class="line_180"></div><div class="line_90"></div><div class="line_270"></div></div></div>';

  style.innerHTML += sCss;
  measureAngle.className = 'measure-angle'
  measureAngle.style.appRegion = 'no-drag'
  measureAngle.draggable = false
  measureAngle.style.left = (window.innerWidth / 2 - radius) + 'px'
  measureAngle.style.top = (window.innerHeight / 2 - radius) + 'px'
  moveCenter.x = window.innerWidth / 2
  moveCenter.y = window.innerHeight / 2

  document.head.appendChild(style);
  document.body.appendChild(measureAngle);
  resetInnerCircle()
}

function bindOplineEvent() {

  let _dragEle = document.querySelector('.measure-angle')
  let _line90 = document.querySelector('.line_90')
  let _line270 = document.querySelector('.line_270')

  if (_line90) {
    _line90.innerHTML = deg90InBottom ? '270' : '90'
    _line90.addEventListener('mousedown', function (e) {
      if (!_dragEle) {
        return
      }
      let _act = true
      e.stopPropagation()
      const bound = _dragEle.getBoundingClientRect()
      const center = {x: bound.left + bound.width / 2, y: bound.top + bound.height / 2}
      document.onmousemove = (e) => {
        if (!_act) {
          return
        }
        const downX = e.clientX
        const downY = e.clientY
        const radian = Math.atan2(downY - center.y, downX - center.x)
        const deg = radian2Angle(radian)
        setLinePositionByAngle({ curEle: _line90, oppositeEle: _line270, deg })

        if (inputAngle){
          inputAngle.value = curAngle
        }
        setWrapWidth()
      }
      document.onmouseup = (e) => {
        _line90.style.removeProperty('height')
        _line270.style.removeProperty('height')
        _act = false
        clear()
      }
    })
  }

  if (_line270) {
    _line270.innerHTML = deg90InBottom ? '90' : '270'
    _line270.addEventListener('mousedown', function (e) {
      if (!_dragEle) {
        return
      }
      let _act = true
      e.stopPropagation()
      const bound = _dragEle.getBoundingClientRect()
      const center = {x: bound.left + bound.width / 2, y: bound.top + bound.height / 2}
      document.onmousemove = (e) => {
        if (!_act) {
          return
        }
        const downX = e.clientX
        const downY = e.clientY
        const radian = Math.atan2(downY - center.y, downX - center.x)
        const deg = radian2Angle(radian)
        setLinePositionByAngle({ curEle: _line270, oppositeEle: _line90, deg })

        if (inputAngle){
          inputAngle.value = curAngle
        }
        setWrapWidth()
      }
      document.onmouseup = (e) => {
        _line270.style.removeProperty('height')
        _line90.style.removeProperty('height')
        _act = false
        clear()
      }
    })
  }
}

function setLinePositionByAngle ({ curEle, oppositeEle, deg}) {
  const curDeg = calcStateRotation(deg)
  const cssAngle = calCssAngle(curDeg)
  curEle.style.transform = `rotate(${cssAngle}deg)`;
  curEle.innerHTML = curDeg

  const oppositeAngle = calOppositeAngle(cssAngle)
  oppositeEle.style.transform = `rotate(${oppositeAngle}deg)`;
  oppositeEle.innerHTML = calcStateRotation(curDeg - 180)
  if (curEle.className === 'line_90') {
    curAngle = curDeg
  } else {
    curAngle = calcStateRotation(curDeg - 180)
  }

}

function bindMeasureAngleEvent() {
  let _dragEle = document.querySelector('.measure-angle')
  let style = {}
  let curOutCircleRotate = 0

  const dragEnter = (e) => {
    if (e.type !== 'mousedown') {
      return
    }
    let _actMove = false
    let _actRotate = false
    // 按下位置
    const downX = e.clientX
    const downY = e.clientY
    const bcr = _dragEle.getBoundingClientRect()
    style = { left: _dragEle.style.left.replace('px', ''), top: _dragEle.style.top.replace('px', '') }
    const center = {x: bcr.left + bcr.width / 2, y: bcr.top + bcr.height / 2}

    const dis = Math.sqrt((downX-center.x)*(downX-center.x) + (downY-center.y)*(downY-center.y));
    if(dis <= radius - 50){
      _actMove = true
      // console.log("yes move!");
    }else{
      _actRotate = true
      const radian = Math.atan2(downY - center.y, downX - center.x)
      let deg = radian * 180 / Math.PI
      const curDeg = calcStateRotation(deg + 90)
      curOutCircleRotate = curDeg
      // console.log("Oh, rotate!");
    }
    document.onmousemove = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!_dragEle) {
        return;
      }
      if (!_actMove && !_actRotate) {
        return
      }

      // 移动当前元素
      if (_actMove) {
        // const bound = _dragEle.getBoundingClientRect()
        const left = e.clientX - downX + Number(style.left)
        const top = e.clientY - downY + Number(style.top)
        const {width, height} = bcr
        _dragEle.style.left = Math.min(Math.max(left, -(width / 2)), window.innerWidth - width / 2) + 'px'
        _dragEle.style.top = Math.min(Math.max(top, -(height / 2)), window.innerHeight - height / 2) + 'px'
        //
        // _dragEle.style.transform = `rotate(${outCircleRotate}deg)`
      }
      if (_actRotate) {
        const downX = e.clientX
        const downY = e.clientY

        const radian = Math.atan2(downY - center.y, downX - center.x)

        let deg = radian * 180 / Math.PI
        const curDeg = calcStateRotation(deg + 90)
        const delta = Math.abs(curOutCircleRotate - curDeg)
        if (curOutCircleRotate < curDeg) {
          outCircleRotate += delta
        } else {
          outCircleRotate -= delta
        }
        curOutCircleRotate = curDeg
        outCircleRotate = Number(outCircleRotate)
        _dragEle.style.transform = `rotate(${outCircleRotate}deg)`
      }
    }

    document.onmouseup = (e) => {
      if (_actMove) {

        const bcr = _dragEle.getBoundingClientRect()
        moveCenter.x = bcr.left + bcr.width / 2
        moveCenter.y = bcr.top + bcr.height / 2
      }


      _actMove = false
      _actRotate = false
      clear()
    }

  }


  if (_dragEle) {
    _dragEle.addEventListener('mousedown', dragEnter)
  }

}

function changeRadius() {
  const exist = document.getElementById('changeRadius')
  if (exist) {
    exist.remove()
  }
  const style = document.createElement('style');
  style.id = 'changeRadius'
  const WIDTH = radius * 2
  const sCss = `.measure-angle {display: block; width: ${WIDTH - BORDER_WIDTH}px; height: ${WIDTH - BORDER_WIDTH}px;}.measure-angle li { transform-origin: center ${radius}px; left: ${radius - 1}px; } .line_0,.line_90,.line_180,.line_270 { transform-origin: center ${radius}px; left: ${radius - 1}px; }`
  style.innerHTML += sCss;
  document.head.appendChild(style);
  resetPos()
  resetInnerCircle()
  changeLineLength()
}

function changeLineLength () {
  const length = calOplineLength()
  const exist = document.getElementById('changeLineLength')
  if (exist) {
    exist.remove()
  }
  const style = document.createElement('style');
  style.id = 'changeLineLength'

  const sCss = `.line_0::after, .line_180::after, .line_270::after, .line_90::after {height: ${length}px};`
  style.innerHTML += sCss;
  document.head.appendChild(style);
}

function changeLineColor(color) {
  const exist = document.getElementById('changeLineColor')
  if (exist) {
    exist.remove()
  }
  const style = document.createElement('style');
  style.id = 'changeLineColor'

  const sCss = `.line_0,.line_180 {border-left: 1px solid ${color};} .line_0::after, .line_180::after {background: ${color}}`
  style.innerHTML += sCss;
  document.head.appendChild(style);
}
function changeLineColor2(color) {
  const exist = document.getElementById('changeLineColor2')
  if (exist) {
    exist.remove()
  }
  const style = document.createElement('style');
  style.id = 'changeLineColor2'

  const sCss = `.line_90,.line_270 {color:${color};border-left: 1px solid ${color};} .line_270::after, .line_90::after {background: ${color}; `
  style.innerHTML += sCss;
  document.head.appendChild(style);
  inputAngle.style.color = `${color}`
}

function resetPos () {
  let _dragEle = document.querySelector('.measure-angle')
  _dragEle.style.left = Number(moveCenter.x - radius) + 'px'
  _dragEle.style.top = Number(moveCenter.y - radius) + 'px'
}

function resetInnerCircle () {
  // const size = calInnerCircle()
  // 大圆内径
  const diameter = radius * 2 - 92
  // 小圆内径 = 大圆内径 * innerCircleRadio
  const size = diameter * (innerCircleRadio / 100)
  let circle = document.querySelector('.inner_circle')
  circle.style.width = size + 'px'
  circle.style.height = size + 'px'
}

function setInnerCircleStyle (color) {
  const exist = document.getElementById('changeInnerCircleStyle')
  if (exist) {
    exist.remove()
  }
  const style = document.createElement('style');
  style.id = 'changeInnerCircleStyle'

  const sCss = `.inner_circle {border: 2px solid ${color};}`
  style.innerHTML += sCss;
  document.head.appendChild(style);
}

create()
bindOplineEvent()
bindMeasureAngleEvent()
const inputAngle = document.querySelector("#inputAngle")
const wrapAngle = document.querySelector("#wrapAngle")

function setWrapWidth () {
  wrapAngle.style.width = Number(inputAngle.value.length) * 40 + 'px'
}

window.addEventListener("resize", () => {
  moveCenter.x = window.innerWidth / 2
  moveCenter.y = window.innerHeight / 2
  resetPos()
});

// 从缓存读取设置初始化状态
window.addEventListener('DOMContentLoaded', () => {
  radius = document.querySelector("#radiusInput").value || 150
  let _maEle = document.querySelector('.measure-angle')
  const opacityValue = document.querySelector("#opacityValue")
  _maEle.style.border = `46px solid rgba(255, 255, 255, ${opacityValue.value})`
  const inputColor1 = document.querySelector("#inputColor1").value
  const inputColor2 = document.querySelector("#inputColor2").value

  const inputInnerCircleRadio = document.querySelector("#inputInnerCircleRadio")
  innerCircleRadio = Number(inputInnerCircleRadio.value)
  changeRadius()
  changeLineColor(inputColor1)
  changeLineColor2(inputColor2)

  const inputLineRadio = document.querySelector("#inputLineRadio")
  lineRadio = inputLineRadio.value
  changeLineLength()
  inputLineRadio.addEventListener("input", (event) => {
    lineRadio = Number(event.target.value)
    changeLineLength()
  })

  // 改变小圆颜色
  const innerCircleColor = document.querySelector("#innerCircleColor")
  setInnerCircleStyle(innerCircleColor.value)
  innerCircleColor.addEventListener("input", (event) => {
    if (event.target.value) {
      setInnerCircleStyle(event.target.value)
    }
  })
  // 改变小圆比例
  inputInnerCircleRadio.addEventListener("input", (event) => {
    if (event.target.value) {
      innerCircleRadio = Number(event.target.value)
      resetInnerCircle()
    }
  })
})
