const TetrioWindow = require('./TetrioWindow')
const { convertTetrioState } = require('../utils/convert-tetrio-state')

const OBSERVE_INTERVAL = 1000

class TetrioStateManager {

    /**
     * @param {TetrioWindow} tetrio 
     */
    constructor(tetrio) {
        this._tetrio = tetrio
        this._state = { state: 'Not logged in', details: 'Main Menu' }
        this._rawState = {}
    }

    get state() { return this._state }

    async _updateState() {
        const rawState = await this._tetrio.fetchGameState()
        if (!rawState) return

        const newState = convertTetrioState(this._rawState, rawState)
        if (newState) this._state = newState
        this._rawState = rawState
    }

    async observe() {
        await this._updateState()
        this._interval = setInterval(() => {
            this._updateState()
        }, OBSERVE_INTERVAL)
    }

    stopObserving() {
        if (typeof this._interval === 'number') {
            clearInterval(this._interval)
            this._interval = undefined
        }
    }

}

module.exports = TetrioStateManager