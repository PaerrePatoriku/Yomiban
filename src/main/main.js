import { registerIPC } from "./windowIpc"
import { attachBackend } from "./backendBridge";
import { readConfig } from "./config"
import { useGlobals } from "./shortcuts"
import { useExtensionLoader } from "./extensions";
import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron/main";
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { session } from "electron"
import {join} from "path"

//const env = process.env.NODE_ENV || 'development';
//const path = require('path');
const env = 'development';



const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload : join(__dirname, '../preload/preload.js')
        },
        frame: false,
        transparent: true
    })
    //win.loadFile('index.html')
    return win;
}

let window;
const config = readConfig();
const extensionLoader = useExtensionLoader();

console.log(config);

app.whenReady().then(async () => {


    console.log("Loading extensions from config...");
    extensionLoader.loadExtensions(config.extensions);
    console.log(`${config.extensions.length} extensions loaded!`);

    window = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            window = createWindow()
    })

    const globals = useGlobals(window); //Global shortfuck functions.


    registerIPC(); //Custom menu controls

    
    Object.keys(config.inputBindings).forEach(action => {        
        
        const actionKey = config.inputBindings[action];
        console.log(`Binding ${action} to ${actionKey}`)
        globalShortcut.register(actionKey, () => globals[action]());
    })

    const pid = attachBackend(app, window, config.webSocket); //Stdio bridge to backend
    //Lifecycle handling for child process
    app.on("window-all-closed", async () => {

        app.quit();
        process.kill(pid);
    });

   // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    //    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  //  } else {
        window.loadFile(join(__dirname, '../renderer/index.html'))
   // }
    window.webContents.openDevTools();
    window.setAlwaysOnTop(true, "normal");
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