const { BrowserWindow } = require('electron')

const QUERIES = {
    username: 'document.querySelector("#me_username").innerText',
    level: 'document.querySelector("#me_level").innerText',
    inMenu: 'document.querySelector("#menus").getAttribute("data-menu-type") !== "none"'
}

/**
 * @param {BrowserWindow} browserWindow
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
        const username = await windowFetch(tetrioWindow, QUERIES.username)
        if (!username.length) {
            return { 
                state: 'Not logged in',
                details: 'Menu Screen'
            }
        }

        const level = await windowFetch(tetrioWindow, QUERIES.level)
        const inMenu = await windowFetch(tetrioWindow, QUERIES.inMenu)
        
        return {
            state: `${username.toUpperCase()} (Level ${level})`,
            details: inMenu ? 'Menu Screen' : 'Playing'
        }
    }
    catch (err) { console.log(err); return }
}