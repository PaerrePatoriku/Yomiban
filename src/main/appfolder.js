import fs from 'fs';
import path from "path";
import { app } from 'electron';
import { useResourceHelper  } from "./resourcehelper";
import { useDefaultConfig  } from './defaultconfig';
const helper = useResourceHelper();
const isWindows = process.platform == "win32";
const appDataFolder = isWindows ? `${app.getPath("appData")}/Roaming` : `${app.getPath("appData")}`;

const appFolder = `${appDataFolder}/Yomiban`;
const configFolder = `${appDataFolder}/Yomiban/configuration`;
const extensionFolder = `${appDataFolder}/Yomiban/extensions`;

function useAppFolder()
{
    function getAppFolder () { 
        if (!fs.existsSync(appFolder))
        {
            fs.mkdirSync(appFolder);
        } 
        if (!fs.existsSync(configFolder))
        {
            fs.mkdirSync(configFolder);
            fs.writeFileSync(path.join(configFolder, "config.json"), JSON.stringify(useDefaultConfig().getDefaultConfig(), null, 2))
        }
        if (!fs.existsSync(extensionFolder))
        {
            fs.mkdirSync(extensionFolder);
        }
        return appFolder;
    }
    return {getAppFolder}
}
export { useAppFolder }