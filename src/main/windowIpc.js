import { ipcMain, BrowserWindow } from 'electron';
const registerIPC = () =>
{
        ipcMain.handle('window:isMaximized', (event) => {
        return BrowserWindow.fromWebContents(event.sender).isMaximized();
    });

    ipcMain.handle('window:minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win.minimizable) win.minimize();
    });

    ipcMain.handle('window:maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win.maximizable) win.maximize();
    });

    ipcMain.handle('window:unmaximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win.unmaximize();
    });

    ipcMain.handle('window:toggleMaximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win.isMaximized() ? win.unmaximize() : win.maximize();
    });

    ipcMain.handle('window:close', (event) => {
        BrowserWindow.fromWebContents(event.sender).close();
    });

    ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
        console.log("Changing mouse event status", ignore)
        const win = BrowserWindow.fromWebContents(event.sender)
        win.setIgnoreMouseEvents(ignore, options)
    })
    /*ipcMain.on('display-app-menu', (event, { x, y }) => {
    const menu = Menu.buildFromTemplate([
        { label: 'Reload', role: 'reload' },
        { label: 'DevTools', role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'quit' }
    ]);


    menu.popup({
        window: BrowserWindow.fromWebContents(event.sender),
        x,
        y
        });
    });*/
}
export { registerIPC }
