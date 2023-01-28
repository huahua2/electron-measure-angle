// 默认半径
let radius = 150
// 90°在下面，false在上面
const deg90InBottom = false

// 外圈旋转度数
let outCircleRotate = 0
let moveCenter = {x: 0, y: 0}

// 92是边框的宽度
const BORDER_WIDTH = 92
// 1mm == 3.77px
const mmtoPX = 3.77


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.radius) {
//     radius = Number(request.radius)
//     if (!request.startMeasure) {
//       changeRadius()
//     }
//   }
//   if (request.startMeasure) {
//     changeRadius()
//   }
//   if (request.angle) {
//     let _line90 = document.querySelector('.line_90')
//     let _line270 = document.querySelector('.line_270')
//     setLinePositionByAngle({ curEle: _line90, oppositeEle: _line270, deg: request.angle })
//   }
//   if (request.opacity !== undefined) {
//     let _dragEle = document.querySelector('.measure-angle')
//     _dragEle.style.border = `46px solid rgba(255, 255, 255, ${request.opacity})`
//   }
//   if (request.lineColor1) {
//     changeLineColor(request.lineColor1)
//   }
//   if (request.lineColor2) {
//     changeLineColor2(request.lineColor2)
//   }
// })

// 计算里面小圆的大小
function calInnerCircle () {
  const WIDTH = radius * 2
  // 里面圆的边框是2px
  const innerCircleBorderWidth = 2
  // 计算外圆内径
  const innerCircleSizeMm = (WIDTH - BORDER_WIDTH) / mmtoPX
  // 每12mm内径，里面圆的直径是2mm
  const radio = innerCircleSizeMm / 12
  // 减掉边框2px
  return Number(radio * 2 * mmtoPX - innerCircleBorderWidth).toFixed(2)
}

function radian2Angle(radian) {
  let deg = radian * (deg90InBottom ? 180 : -180) / Math.PI
  // if (outCircleRotate > 0) {
  if (deg90InBottom) {
    deg -= outCircleRotate
  } else {
    deg += outCircleRotate
  }
  // }
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
  curEle.style.height = `60px`;

  const oppositeAngle = calOppositeAngle(cssAngle)
  oppositeEle.style.transform = `rotate(${oppositeAngle}deg)`;
  oppositeEle.innerHTML = calcStateRotation(curDeg - 180)
  oppositeEle.style.height = `60px`;
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
    // _dragEle.style.transform = 'none'
    const bcr = _dragEle.getBoundingClientRect()
    style = { left: _dragEle.style.left.replace('px', ''), top: _dragEle.style.top.replace('px', '') }
    const center = {x: bcr.left + bcr.width / 2, y: bcr.top + bcr.height / 2}

    const dis = Math.sqrt((downX-center.x)*(downX-center.x) + (downY-center.y)*(downY-center.y));
    if(dis <= radius - 50){
      _actMove = true
      console.log("yes move!");
    }else{
      _actRotate = true
      const radian = Math.atan2(downY - center.y, downX - center.x)
      let deg = radian * 180 / Math.PI
      const curDeg = calcStateRotation(deg + 90)
      curOutCircleRotate = curDeg
      console.log("Oh, rotate!");
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
        // const center = {x: , y: bcr.top + bcr.height / 2
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

  const sCss = `.line_90,.line_270 {border-left: 1px solid ${color};} .line_270::after, .line_90::after {background: ${color}}`
  style.innerHTML += sCss;
  document.head.appendChild(style);
}

function resetPos () {
  let _dragEle = document.querySelector('.measure-angle')
  _dragEle.style.left = Number(moveCenter.x - radius) + 'px'
  _dragEle.style.top = Number(moveCenter.y - radius) + 'px'
}

function resetInnerCircle () {
  const size = calInnerCircle()
  let circle = document.querySelector('.inner_circle')
  circle.style.width = size + 'px'
  circle.style.height = size + 'px'
}

create()
bindOplineEvent()
bindMeasureAngleEvent()

window.addEventListener("resize", () => {
  // moveCenter.x = window.innerWidth / 2
  // moveCenter.y = window.innerHeight / 2
  resetPos()
});

