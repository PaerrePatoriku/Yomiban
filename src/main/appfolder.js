const fs = require('fs')
import { app } from 'electron';

const appFolder = `${app.getPath("appData")}/Yomiban`

function useAppFolder()
{
    function getAppFolder () { 
        if (!fs.existsSync(appFolder)) fs.mkdirSync(appFolder);
        return appFolder;
    }
    return {getAppFolder}
}
export { useAppFolder }