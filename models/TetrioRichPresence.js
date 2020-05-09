const richPresence = require('discord-rich-presence')
const TetrioWindow = require('./TetrioWindow')

const UPDATE_INTERVAL = 15 * 1000

class TetrioRichPresence {

    /**
     * @param {string} id 
     * @param {TetrioWindow} tetrio 
     */
    constructor(id, tetrio) {
        this._id = id
        this._tetrio = tetrio
        this.connect()
    }

    start() {
        this._interval = setInterval(
            () => { this._updatePresence() }, 
            UPDATE_INTERVAL
        )
        this._updatePresence()
    }

    stop() {
        if (typeof this._interval === 'number') {
            clearInterval(this._interval)
            this._interval = undefined
        }
    }

    connect() {
        this._rp = richPresence(this._id)
    }

    disconnect() {
        this._rp.disconnect()
        this._rp = undefined
    }

    async _updatePresence() {
        if (!this._rp || !this._tetrio.isActive) return
        
        const gameState = await this._tetrio.fetchGameState()
        if (!gameState) return

        this._rp.updatePresence({
            ...gameState,
            largeImageKey: 'default',
            instance: true
        })
    }

}

module.exports = TetrioRichPresence