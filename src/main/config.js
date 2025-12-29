const fs = require('fs')
import { app, ipcMain } from 'electron';
import path from 'path';
import { useDefaultConfig } from './defaultconfig';
import { useAppFolder } from './appfolder';


const defaultConfig = useDefaultConfig();
const defaults = defaultConfig.getDefaultConfig();
const appFolder = useAppFolder();
const filePath = path.join(appFolder.getAppFolder(), "configuration", 'config.json')

function useConfig()
{
    let _cfg;
    function _init() {
        const file = fs.readFileSync(filePath, 'utf8');
        _cfg = JSON.parse(file);
    }
    function _setDeep(obj, propertyPath, value)
    {
        const arrPath = Array.isArray(propertyPath) ? propertyPath : propertyPath.split("."); //can use either direct array, or dot separated
        let current = obj;
        for (let i = 0; i < arrPath.length; i++) {
            const currentKey = arrPath[i];
            if (i == arrPath.length - 1)
            {
                current[currentKey] = value;
            }
            else if (current[currentKey] === null || current[currentKey] !== 'object')
            {
                current[currentKey] = {}
            }
            current = current[currentKey];
        }
        return current;
    }
    function setConfig(config)
    {
        _cfg = config;
    }
    function getConfig() {
        return _cfg;
    }
    function updateConfig(propertyPath, value)
    {
        _setDeep(_cfg, propertyPath, value);
    }
    

    ipcMain.handle('config:get', () => getConfig());
    ipcMain.handle('config:set', (_, cfg) => setConfig(cfg));
    ipcMain.handle('config:update', (_, propertyPath, value) => getConfig(propertyPath, value));

    _init();

    return { setConfig, getConfig, updateConfig }
}

export { useConfig }