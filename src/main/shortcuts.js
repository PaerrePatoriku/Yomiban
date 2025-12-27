import { BrowserWindow  } from 'electron';

let inputIgnored = false;
function useGlobals (window) 
{
    const globals = {
        "clickthrough": () => {
            inputIgnored = !inputIgnored
            window.setIgnoreMouseEvents(inputIgnored);
            window.webContents.send('clickthrough-toggle', { clickIgnored : inputIgnored })
        }
    }
    return globals;
}
export { useGlobals }
