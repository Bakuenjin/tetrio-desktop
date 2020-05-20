const path                      = require('path')
const { EventEmitter }          = require('events')
const { BrowserWindow, shell }  = require('electron')
const { fetchTetrioState }      = require('../utils/fetch-tetrio-state')
const TetrioStore               = require('./TetrioStore')

/**
 * Responsible for creating a BrowserWindow instance
 * showing the TETR.IO website.
 */
class TetrioWindow extends EventEmitter {

	constructor() {
		super()
		this._store = new TetrioStore()
		this._window = new BrowserWindow({
			title: 'TETR.IO',
			show: false,
			backgroundColor: "#111111",
			icon: path.join(__dirname, '..', 'build', 'icon.ico'),
			webPreferences: { enableRemoteModule: false },
			...this._store.getBounds()
		})

		this._initialize()
	}

	/**
	 * Initializes the BrowserWindow and its events.
	 */
	async _initialize() {
		this._window.on('ready-to-show', () => {
			this._window.show()
			this._store.initialize(this._window)
			if (this._store.getIsMaximized())
				this._window.maximize()
			this.emit('tetrio-started')
		})

		this._window.on('closed', () => {
			this._window = undefined
			this.emit('tetrio-closed')
		})

		this._window.on('minimize', () => {
			this._window.webContents.setAudioMuted(true)
		})

		this._window.on('focus', () => {
			this._window.webContents.setAudioMuted(false)
		})

		this._window.webContents.on('new-window', (e, url) => {
			e.preventDefault()
			shell.openExternal(url)
		})
		this._window.webContents.on('will-navigate', (e, url) => {
			if (url != this._window.webContents.getURL()) {
				e.preventDefault()
				shell.openExternal(url)
			}
		})

		this._window.setMenuBarVisibility(false)
		await this._window.loadURL('https://tetr.io/')
	}

	/**
	 * Fetches the current TETR.IO state
	 */
	fetchGameState() {
		if (!this._window) return
		return fetchTetrioState(this._window)
	}

	/**
	 * Is the BrowserWindow showing the TETR.IO website is still active?
	 */
	get isActive() { return !!this._window }

}

module.exports = TetrioWindow
