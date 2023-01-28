const {ipcRenderer: ipc} = require('electron');


/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
window.addEventListener('DOMContentLoaded', () => {
  if (process.platform !== 'darwin') {
    document.getElementById('mac-op').remove()
  } else {
    document.getElementById('windows-op').remove()
  }
  // if (process.platform !== 'darwin') {
  //   document.querySelector('.test').addEventListener('dblclick', ()=> {
      // alert()
      // ipc.send('max');
    // }, false)
  // }
  document.getElementById('btn_close').addEventListener('click', ()=> {
    ipc.send('close');
  })
  document.getElementById('btn_min').addEventListener('click', ()=> {
    ipc.send('min');
  })
  document.getElementById('btn_max')?.addEventListener('click', ()=> {
    ipc.send('max');
  })

})
