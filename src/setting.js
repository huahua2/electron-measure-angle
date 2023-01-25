//
// const btn = document.querySelector('.btn_measure')
// btn.addEventListener('click', function () {
//   const input = document.querySelector("#inputAngle")
//   let message = {
//     startMeasure: true,
//     radius: value.textContent,
//     opacity: opacityValue.textContent
//   }
//   if (input.value.trim() !== '') {
//     message.angle = Number(input.value)
//   }
//   if (inputColor1.value !== '') {
//     message.lineColor1 = inputColor1.value
//   }
//
//   if (inputColor2.value !== '') {
//     message.lineColor2 = inputColor2.value
//   }
//   sendMsg(message)
//   window.close()
// })

const value = document.querySelector("#value")
const input = document.querySelector("#pi_input")
value.textContent = input.value


const opacityValue = document.querySelector("#opacityValue")
const opacityInput = document.querySelector("#opacity")
opacityValue.textContent = opacityInput.value

const inputColor1 = document.querySelector("#inputColor1")
const inputColor2 = document.querySelector("#inputColor2")


// chrome.storage.local.get(['object', 'string'], function(obj){
//   if (obj.object.measureRadius !== undefined) {
//     value.textContent = obj.object.measureRadius
//     input.value = obj.object.measureRadius
//   }
//
//   if (obj.object.opacity !== undefined) {
//     opacityInput.value = obj.object.opacity
//     opacityValue.textContent = obj.object.opacity
//   }
//
//   if (obj.object.lineColor1 !== undefined) {
//     inputColor1.value = obj.object.lineColor1
//   }
//
//   if (obj.object.lineColor2 !== undefined) {
//     inputColor2.value = obj.object.lineColor2
//   }
// });

input.addEventListener("input", (event) => {
  radius = Number(event.target.value)
  changeRadius()
  value.textContent = event.target.value
  // sendMsg({
  //   radius: value.textContent
  // })
  // chrome.storage.local.set({
  //   object: {measureRadius: value.textContent },
  // }, function(){
  //   console.log('measureRadius保存成功');
  // })

})

opacityInput.addEventListener("input", (event) => {
  opacityValue.textContent = event.target.value
  if (event.target.value !== '') {
    let _dragEle = document.querySelector('.measure-angle')
    _dragEle.style.border = `46px solid rgba(255, 255, 255, ${event.target.value})`
  }
  // sendMsg({
  //   opacity: opacityValue.textContent
  // })
  // chrome.storage.local.set({
  //   object: {opacity: opacityValue.textContent },
  // }, function(){
  //   console.log('opacity保存成功');
  // })

})

inputColor1.addEventListener("input", (event) => {
  console.log(event.target.value);
  sendMsg({
    lineColor1: event.target.value
  })
  chrome.storage.local.set({
    object: {lineColor1: event.target.value },
  }, function(){
    console.log('lineColor1保存成功');
  })

})
inputColor2.addEventListener("input", (event) => {
  console.log(event.target.value);
  sendMsg({
    lineColor2: event.target.value
  })
  chrome.storage.local.set({
    object: {lineColor2: event.target.value },
  }, function(){
    console.log('lineColor2保存成功');
  })

})


function sendMsg (msg) {
  console.log('sendMsg')
  // popup ---> content
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, msg, res => {
      console.log('popup=>content')
      console.log(res)
    })
  })
}
