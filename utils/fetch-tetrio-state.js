const { BrowserWindow } = require('electron')

const QUERIES = {
    username: 'document.querySelector("#me_username").innerText',
    level: 'document.querySelector("#me_level").innerText',
    menu: 'document.querySelector("#menus").getAttribute("data-menu-type")'
}

/**
 * @param {BrowserWindow} browserWindow
 * @param {string} query
 * @returns {string}
 */
const windowFetch = (browserWindow, query) => {
    return browserWindow.webContents.executeJavaScript(query)
}

/**
 * @param {BrowserWindow} tetrioWindow
 */
exports.fetchTetrioState = async (tetrioWindow) => {
    try {
        return {
            username:   (await windowFetch(tetrioWindow, QUERIES.username)).toUpperCase(),
            level:      await windowFetch(tetrioWindow, QUERIES.level),
            menu:       await windowFetch(tetrioWindow, QUERIES.menu)
        }
    }
    catch (err) { console.log(err); return }
}