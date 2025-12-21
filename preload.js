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


let isMouseOverInteractiveElement = false;
/*


    element.addEventListener('mouseenter', () => {
      console.log("leaveing interactive")
      isMouseOverInteractiveElement = true;
      ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
    });
  });
  interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        console.log("entering interactive")
        isMouseOverInteractiveElement = false;
        ipcRenderer.send('set-ignore-mouse-events', false);
    });
  });
});*/