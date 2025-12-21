const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'config.json')


function readConfig() {
    const file = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(file);
}
module.exports = { readConfig }