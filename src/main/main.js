import { registerIPC } from "./windowIpc"
import { useBackend } from "./backendBridge";
import { useConfig } from "./config"
import { useGlobals } from "./shortcuts"
import { useExtensionLoader } from "./extensions";
import { useResourceHelper  } from "./resourcehelper";
import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron/main";
import { is } from '@electron-toolkit/utils'
import { join } from "path"


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
        icon : join(resources.getResourcePath(), "images", "main-icon.png"),
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

    Object.keys(config.inputBindings).forEach(action => {

        const actionKey = config.inputBindings[action];
        console.log(`Binding ${action} to ${actionKey}`)
        globalShortcut.register(actionKey, () => globals[action]());
    })

    window.on('ready-to-show', () => window.show() )

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
            app.quit();
            process.kill(pid);
        });
        
    })


})

//Manage lifecycle
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

