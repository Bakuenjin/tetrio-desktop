const path = require('path')
const { BrowserWindow } = require('electron')

const QUERIES = {
	username: 'document.querySelector("#me_username").innerText',
	level: 'document.querySelector("#me_level").innerText',
	menu: 'document.querySelector("#menus").getAttribute("data-menu-type")',
	inGame: 'document.body.classList.contains("ingame")',
	rank: 'document.querySelector("#me_leaguerank").src'
}

/**
 * @param {BrowserWindow} browserWindow - The browser window that executes the JavaScript
 * @param {string} query - The string to execute
 * @returns {Promise<any>} A promise that resolves with the result of the code execution
 */
const windowFetch = (browserWindow, query) => {
	return browserWindow.webContents.executeJavaScript(query)
}

/**
 * Fetches the current TETR.IO state by remotely executing
 * JavaScript to gather data from the DOM.
 * @param {BrowserWindow} tetrioWindow - The browser window that executes the JavaScript
 */
exports.fetchTetrioState = async (tetrioWindow) => {
	try {

		const rankIcon = await windowFetch(tetrioWindow, QUERIES.rank)
		const rank = path.basename(rankIcon).split('.')[0]

		return {
			username:   (await windowFetch(tetrioWindow, QUERIES.username)).toUpperCase(),
			level:      await windowFetch(tetrioWindow, QUERIES.level),
			menu:       await windowFetch(tetrioWindow, QUERIES.menu),
			inGame:     await windowFetch(tetrioWindow, QUERIES.inGame),
			rank
		}
	}
	catch (err) { console.log(err); return }
}
