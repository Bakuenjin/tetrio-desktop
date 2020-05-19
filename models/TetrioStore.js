const ElectronStore = require('electron-store')
const { BrowserWindow } = require('electron')

class TetrioStore {

	
	/**
	* Store manager for  certain variables
	*/
	constructor() {
		this._store = new ElectronStore()
	}

	/**
	 * Initialise a browser window
	 * @param {BrowserWindow} window - The browser window to initialise
	 */
	initialize(window) {
		this._window = window
		this._window.on('close', () => {
			this.setBounds()
		})
		this._window.on('maximize', () => { this.setIsMaximized() })
		this._window.on('unmaximize', () => { this.setIsMaximized() })
	}

	/**
	* Get the boundaries of the window
	* @returns {object}
	*/
	getBounds() {
		return this._store.get(
			'window-bounds', 
			{ width: 1280, height: 720 }
		)
	}

	/**
	* Store the current window boundaries
	*/
	setBounds() {
		if (this._window) {
			this._store.set(
				'window-bounds',
				this._window.getBounds()
			)
		}
	}

	/**
	* Check if the window is maximised
	* @returns {boolean}
	*/
	getIsMaximized() {
		return this._store.get('window-maximized', false)
	}

	/**
	* Store the maximised state
	*/
	setIsMaximized() {
		if (this._window) {
			this._store.set(
				'window-maximized',
				this._window.isMaximized()
			)
		}
	}

}

module.exports = TetrioStore
