const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
contextBridge.exposeInMainWorld("backend", {
  onBridgeEvent: (e) => {
    ipcRenderer.on("backend-event", (_, msg) => e(msg));
  }
})
contextBridge.exposeInMainWorld('windowControls', {
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  unmaximize: () => ipcRenderer.invoke('window:unmaximize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
  close: () => ipcRenderer.invoke('window:close'),
  openMenu: (x, y) => ipcRenderer.send('display-app-menu', { x, y })
});
contextBridge.exposeInMainWorld('mainBridge', {
  onClickthroughToggle : (callback) => ipcRenderer.on("clickthrough-toggle", (e, v) => callback(v))
})

