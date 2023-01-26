const {ipcRenderer: ipc} = require('electron');


/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn_close').addEventListener('click', ()=> {
    ipc.send('close');
  })
  document.getElementById('btn_min').addEventListener('click', ()=> {
    ipc.send('min');
  })
})
