const ElectronStore = require('electron-store')
const { BrowserWindow } = require('electron')

class TetrioStore {

    
    constructor() {
        this._store = new ElectronStore()
    }

    /**
     * @param {BrowserWindow} window 
     */
    initialize(window) {
        this._window = window
        this._window.on('close', () => {
            this.setBounds()
        })
        this._window.on('maximize', () => { this.setIsMaximized() })
        this._window.on('unmaximize', () => { this.setIsMaximized() })
    }

    getBounds() {
        return this._store.get(
            'window-bounds', 
            { width: 1280, height: 720 }
        )
    }

    setBounds() {
        if (this._window) {
            this._store.set(
                'window-bounds',
                this._window.getBounds()
            )
        }
    }

    getIsMaximized() {
        return this._store.get('window-maximized', false)
    }

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