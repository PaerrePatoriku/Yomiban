import { registerIPC } from "./windowIpc"
import { useBackend } from "./backendBridge";
import { useConfig } from "./config"
import { useGlobals } from "./shortcuts"
import { useExtensionLoader } from "./extensions";
import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron/main";
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { session } from "electron"
import { join } from "path"





const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            sandbox: false
        },
        frame: false,
        transparent: true
    })

    return win;
}

let window;
const config = useConfig();
const extensionLoader = useExtensionLoader();
const backend = useBackend();

console.log(config);


app.whenReady().then(async () => {


    window = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            window = createWindow()
    })

    const globals = useGlobals(window); //Global shortfuck functions.


    registerIPC(); //Custom menu controls


    Object.keys(config.getConfig().inputBindings).forEach(action => {

        const actionKey = config.getConfig().inputBindings[action];
        console.log(`Binding ${action} to ${actionKey}`)
        globalShortcut.register(actionKey, () => globals[action]());
    })



    window.on('ready-to-show', () => {
        window.show()
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        window.loadFile(join(__dirname, '../renderer/index.html'))
    }

    console.log("Loading extensions from config...");
    extensionLoader.loadExtensions(config.getConfig().extensions);
    console.log(`${config.getConfig().extensions.length} extensions loaded!`);

    if (config.getConfig().debug)
        window.webContents.openDevTools();

    window.setAlwaysOnTop(true, "normal");

    const pid = backend.attachBackend(window, config.getConfig().webSocket); //Stdio bridge to backend
    backend.connectBackend();

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

//if (is.dev) {
/*    try {
        require('electron-reloader')(module, {
            debug: false,
            watchRenderer: true
        });
    } catch (_) { console.log('Error'); }*/
//}