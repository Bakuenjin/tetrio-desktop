const path = require('path')
const { BrowserWindow } = require('electron')

const QUERIES = {
    username: 'document.querySelector("#me_username").innerText',
    level: 'document.querySelector("#me_level").innerText',
    menu: 'document.querySelector("#menus").getAttribute("data-menu-type")',
    rank: 'document.querySelector("#me_leaguerank").src'
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

        const rankIcon = await windowFetch(tetrioWindow, QUERIES.rank)
        const rank = path.basename(rankIcon).split('.')[0]

        return {
            username:   (await windowFetch(tetrioWindow, QUERIES.username)).toUpperCase(),
            level:      await windowFetch(tetrioWindow, QUERIES.level),
            menu:       await windowFetch(tetrioWindow, QUERIES.menu),
            rank
        }
    }
    catch (err) { console.log(err); return }
}