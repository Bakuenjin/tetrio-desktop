const TetrioWindow = require('./TetrioWindow')
const TetriStateConverter = require('./TetrioStateConverter')

const OBSERVE_INTERVAL = 1000

class TetrioStateManager {

    /**
     * @param {TetrioWindow} tetrio 
     */
    constructor(tetrio) {
        this._tetrio = tetrio
        this._converter = new TetriStateConverter()
        this._state = this._converter._previousRichPresence
    }

    get state() { return this._state }

    async _updateState() {
        const rawState = await this._tetrio.fetchGameState()
        if (!rawState) return

        this._state = this._converter.convert(rawState)
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