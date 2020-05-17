const path                      = require('path')
const { EventEmitter }          = require('events')
const { BrowserWindow, shell }  = require('electron')
const { fetchTetrioState }      = require('../utils/fetch-tetrio-state')
const TetrioStore               = require('./TetrioStore')

class TetrioWindow extends EventEmitter {

    /**
     * The window for the app
     */
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
     * Initialise the window and loads tetr.io
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
     * Fetch the game state
     */

    fetchGameState() {
        if (!this._window) return
        return fetchTetrioState(this._window)
    }
    /**
     * Check if player is active
     */

    get isActive() { return !!this._window }

}

module.exports = TetrioWindow