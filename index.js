const { app, BrowserWindow } = require('electron')
const path = require('path');
const { registerIPC } = require("./windowIpc")
const { attachBackend } = require("./backendBridge")
const { readConfig }  = require('./config')
const { dialog, globalShortcut } = require('electron/main')
const { session } = require('electron')
//const env = process.env.NODE_ENV || 'development';
const env = 'development';



const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        frame: false,
        transparent: true
    })
    win.loadFile('index.html')
    return win;
}

let window;
const config = readConfig();
console.log(config);

app.whenReady().then(async () => {


    console.log("Loading extensions from config...");
    config.extensions.forEach(extension => {
        const extensionPath = path.join(__dirname, extension.directory);
        console.log("Loading extension from", extensionPath, "...");
        //Extensions do not function on electron if fileaccess is not given
        session.defaultSession.extensions.loadExtension(extensionPath, { allowFileAccess: true }).then((electronExtension) => {

            const manifest = electronExtension.manifest;
            const optionsPage = manifest.options_ui?.page || manifest.options_page;

            if (extension.openSettings)
            {
                const extWindow = new BrowserWindow({
                    width: 600,
                    height: 800,
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true, // optional but recommended
                    }
                });
        
                extWindow.loadURL(`chrome-extension://${electronExtension.id}/${optionsPage}`);
            }
        })
    });
    console.log("Extensions loaded!");

    window = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            window = createWindow()
    })
    window.webContents.openDevTools()
    window.setAlwaysOnTop(true, "normal")
    registerIPC(); //Custom menu controls
    
    let ignored = false;
    globalShortcut.register("Tab", () => {
        ignored = !ignored
        BrowserWindow.fromWebContents(window.webContents).setIgnoreMouseEvents(ignored)
    });

    const pid = attachBackend(app, window, config.webSocket); //Stdio bridge to backend
    //Lifecycle handling for child process
    app.on("window-all-closed", async () => {

        app.quit();
        process.kill(pid);
    });
})

//Manage lifecycle
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

if (env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: false,
            watchRenderer: true
        });
    } catch (_) { console.log('Error'); }
}