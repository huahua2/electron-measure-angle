// 默认半径
let radius = 150
// 90°在下面，false在上面
const deg90InBottom = false

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

function radian2Angle(radian) {
  return radian * (deg90InBottom ? 180 : -180) / Math.PI
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
  ;

  measureAngle.innerHTML = '<div class="inner_circle"></div><div class="line_wrap"><div class="container">' + "<ul>" + oLi + '</ul><div class="line_0"></div><div class="line_180"></div><div class="line_90"></div><div class="line_270"></div></div></div>';

  style.innerHTML += sCss;
  measureAngle.className = 'measure-angle'
  measureAngle.style.appRegion = 'no-drag'

  document.head.appendChild(style);
  document.body.appendChild(measureAngle);

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
  let _act = false

  const dragEnter = (e) => {
    if (e.type !== 'mousedown') {
      return
    }
    const bcr = _dragEle.getBoundingClientRect()
    _act = true
    // 按下位置
    const downX = e.clientX
    const downY = e.clientY

    document.onmousemove = (e) => {
      if (!_act) {
        return
      }

      // 移动当前元素
      if (_dragEle) {
        const left = e.clientX - downX + bcr.x
        const top = e.clientY - downY + bcr.y
        const bound = _dragEle.getBoundingClientRect()
        const {width, height} = bound
        _dragEle.style.left = Math.min(Math.max(left, -(width / 2)), window.innerWidth - width / 2) + 'px'
        _dragEle.style.top = Math.min(Math.max(top, -(height / 2)), window.innerHeight - height / 2) + 'px'
        _dragEle.style.transform = 'none'
      }
    }

    document.onmouseup = (e) => {
      _act = false
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
  // 92是边框的宽度
  const BORDER_WIDTH = 92
  const WIDTH = radius * 2
  const sCss = `.measure-angle {display: block; width: ${WIDTH - BORDER_WIDTH}px; height: ${WIDTH - BORDER_WIDTH}px;}.measure-angle li { transform-origin: center ${radius}px; left: ${radius - 1}px; } .line_0,.line_90,.line_180,.line_270 { transform-origin: center ${radius}px; left: ${radius - 1}px; }`
  style.innerHTML += sCss;
  document.head.appendChild(style);
  resetPos()
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
  _dragEle.style.left = '50%'
  _dragEle.style.top = '50%'
  _dragEle.style.transform = 'translate(-50%, -50%)'
}

create()
bindOplineEvent()
bindMeasureAngleEvent()

window.addEventListener("resize", () => {
  resetPos()
});
// const dpr = window.devicePixelRatio
// window.addEventListener("resize", () => {
//   if (window.devicePixelRatio === dpr) {
//     return
//   }
//   const aa = dpr - window.devicePixelRatio
//   if (aa > 0){
//     console.log('scaleValue', window.devicePixelRatio)
//     let scale = 0
//     if (aa < 0.5) {
//       scale = 1 + aa
//     } else {
//       if (aa > 0.6) {
//         scale = 2.5
//       } else {
//         scale = 2
//       }
//     }
//     console.log('scale', scale)
//     let _dragEle = document.querySelector('.measure-angle')
//     _dragEle.style.transform = `scale(${scale})`
//   }
// });
