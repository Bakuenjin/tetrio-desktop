const richPresence = require('discord-rich-presence')
const TetrioStateManager = require('./TetrioStateManager')

const UPDATE_INTERVAL = 5 * 1000

class TetrioRichPresence {

    /**
     * @param {string} id - The ID of the Discord Application
     * @param {TetrioStateManager} tetrio - The state manager to pull data from
     */
    constructor(id, tetrio) {
        this._id = id
        this._tetrio = tetrio
        this._prevState = {}
        this.connect()
    }
    /**
     * Start the rich presence loop
     */

    async start() {
        await this._tetrio.observe()
        this._interval = setInterval(
            () => { this._updatePresence() }, 
            UPDATE_INTERVAL
        )
        this._updatePresence()
    }
    /**
     * Stop the rich presence loop
     */

    stop() {
        this._tetrio.stopObserving()
        if (typeof this._interval === 'number') {
            clearInterval(this._interval)
            this._interval = undefined
        }
    }
    /**
     * Connect to Discord's RPC
     */

    connect() {
        this._rp = richPresence(this._id)
    }
    /**
     * Disconnect from Discord's RPC
     */

    disconnect() {
        this._rp.disconnect()
        this._rp = undefined
    }
    /**
     * Update the shown Rich Presence data
     */

    _updatePresence() {
        if (!this._rp) return

        const currState = this._tetrio.state

        if (this._prevState.state === currState.state && this._prevState.details === currState.details)
            return

        this._prevState = currState
        this._rp.updatePresence({
            ...currState,
            largeImageKey: 'default',
            instance: true
        })
    }

}

module.exports = TetrioRichPresence