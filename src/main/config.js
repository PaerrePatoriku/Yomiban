const fs = require('fs')
import { app } from 'electron';
import path from 'path';
const filePath = path.join(app.getAppPath(), "configuration", 'config.json')

function readConfig() {
    const file = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(file);
}
export { readConfig }