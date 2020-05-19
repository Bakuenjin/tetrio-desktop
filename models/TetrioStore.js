const ElectronStore = require('electron-store')
const { BrowserWindow } = require('electron')

/**
 * Responsible for persistent storing of miscellaneous data from the TETR.IO window.
 */
class TetrioStore {

	constructor() {
		this._store = new ElectronStore()
	}

	/**
	 * Initializes the store via the specified `BrowserWindow` instance.
	 * @param {BrowserWindow} window - The `BrowserWindow` instance
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
	* Reads the saved window dimensions.
	* @returns {{width: number, height: number, x?: number, y?: number}}
	*/
	getBounds() {
		return this._store.get(
			'window-bounds', 
			{ width: 1280, height: 720 }
		)
	}

	/**
	* Stores the current window dimensions (width, height, x, y).
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
	* Reads the saved window maximization state.
	* @returns {boolean}
	*/
	getIsMaximized() {
		return this._store.get('window-maximized', false)
	}

	/**
	* Stores teh current window maximization state.
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
