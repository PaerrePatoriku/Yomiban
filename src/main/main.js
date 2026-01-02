import { registerIPC } from "./windowIpc"
import { useBackend } from "./backendBridge";
import { useConfig } from "./config"
import { useGlobals } from "./shortcuts"
import { useExtensionLoader } from "./extensions";
import { useResourceHelper } from "./resourcehelper";
import { app, BrowserWindow } from "electron";

import { is } from '@electron-toolkit/utils'
import { join } from "path"
import { uIOhook, UiohookKey } from "uiohook-napi";

let window;
const configHelper = useConfig();
const config = configHelper.getConfig();
const resources = useResourceHelper();
const extensionLoader = useExtensionLoader();


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            sandbox: false
        },
        icon: join(resources.getResourcePath(), "images", "main-icon.png"),
        frame: false,
        transparent: true
    })

    return win;
}


app.whenReady().then(async () => {

    window = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            window = createWindow()
    })

    const globals = useGlobals(window); //Global shortfuck functions.

    registerIPC(); //Custom menu controls


    const binds = {}
    Object.keys(config.inputBindings).forEach(action => {

        const actionKey = config.inputBindings[action].key;
        console.log(`Binding ${action} to ${actionKey}`)
        const uiokey = Object.keys(UiohookKey).find(x => x === actionKey);
        binds[UiohookKey[uiokey]] = { callback: globals[action], pressed: false }
        console.log(binds);
    })

    uIOhook.on("keydown", (e) => {

        if (binds[e.keycode]) {
            const bind = binds[e.keycode];
            if (!bind.pressed)
            {
                bind.callback();
                console.log(e.keycode, e.type);
            }
            bind.pressed = true;
        }
    })
    uIOhook.on("keyup", (e) => {
        if (binds[e.keycode]) {
            const bind = binds[e.keycode];
            //if (!bind.pressed)
                //bind.callback();
            bind.pressed = false;
        }
    })
    
    uIOhook.start();


    window.on('ready-to-show', () => window.show())

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        window.loadFile(join(__dirname, '../renderer/index.html'))
    }

    console.log("Loading extensions from config...");
    extensionLoader.loadExtensions(config.extensions);
    console.log(`${config.extensions.length} extensions loaded!`);

    if (config.development.showInspector)
        window.webContents.openDevTools();

    window.setAlwaysOnTop(true, "normal");


    app.on("web-contents-created", () => {
        const backend = useBackend(config);
        const pid = backend.attachBackend(window, config.webSocket); //Stdio bridge to backend
        backend.connectBackend();

        //Lifecycle handling for child process
        app.on("window-all-closed", async () => {
            uIOhook.stop();
            app.quit();
            process.kill(pid);
        });

    })


})

//Manage lifecycle
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

