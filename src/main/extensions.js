import { session } from "electron"
import { join } from 'path'
import { app, BrowserWindow } from 'electron';
function useExtensionLoader() {
    function _loadExtension(extension) {

        if (extension?.active == false)
            return;
        const extensionPath = join(app.getAppPath(), "extensions", extension.directory);
        console.log("Loading extension from", extensionPath, "...");
        //Extensions do not function on electron if fileaccess is not given
        session.defaultSession.extensions.loadExtension(extensionPath, { allowFileAccess: true }).then((electronExtension) => {

            const manifest = electronExtension.manifest;
            const optionsPage = manifest.options_ui?.page || manifest.options_page;

            if (extension.openSettings) {
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
    }
    function loadExtensions(extensions) {
        extensions.forEach(ext => _loadExtension(ext));
    }
    return { loadExtensions }
}

export { useExtensionLoader }