import { app } from 'electron'
function useResourceHelper()
{
    function getResourcePath() {
        if (app.isPackaged) {
            return process.resourcesPath
        } else {
            return `${app.getAppPath()}/resources`
        }
    }
    return { getResourcePath }
}
export { useResourceHelper }