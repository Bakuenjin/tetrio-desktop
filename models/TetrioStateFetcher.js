const path = require('path')
const { BrowserWindow } = require('electron')
const TetrioState = require('./TetrioState')

const QUERIES = {
	username: 'document.querySelector("#me_username").innerText',
	level: 'document.querySelector("#me_level").innerText',
	menu: 'document.querySelector("#menus").getAttribute("data-menu-type")',
	inGame: 'document.body.classList.contains("ingame")',
	rank: 'document.querySelector("#me_leaguerank").src'
}

class TetrioStateFetcher {

	/**
	 * Fetches the current TETR.IO state by remotely executing
	 * JavaScript to gather data from the DOM.
	 * @param {BrowserWindow} window - The window that is used to fetch the state from
	 */
	async fetch(window) {
		try {
			const username	= await window.webContents.executeJavaScript(QUERIES.username)
			const level 	= await window.webContents.executeJavaScript(QUERIES.level)
			const menu 		= await window.webContents.executeJavaScript(QUERIES.menu)
			const inGame	= await window.webContents.executeJavaScript(QUERIES.inGame)
			const rankIcon	= await window.webContents.executeJavaScript(QUERIES.rank)
			const rank		= path.basename(rankIcon).split('.')[0]

			return new TetrioState(username, level, menu, inGame, rank)
		}
		catch (err) { console.log(err) }
	}

}

module.exports = TetrioStateFetcher