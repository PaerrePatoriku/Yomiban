import { BrowserWindow  } from 'electron';

let inputIgnored = false;
function useGlobals (window) 
{
    const globals = {
        "clickthrough": () => {
            inputIgnored = !inputIgnored
            BrowserWindow.fromWebContents(window.webContents).setIgnoreMouseEvents(inputIgnored)
        }
    }
    return globals;
}
export { useGlobals }
