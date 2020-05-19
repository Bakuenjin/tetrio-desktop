const TetrioWindow = require('./TetrioWindow')
const TetriStateConverter = require('./TetrioStateConverter')

const OBSERVE_INTERVAL = 1000

class TetrioStateManager {

	/**
	 * Manages the state of the tetr.io window
	 * @param {tetrioWindow} tetrio - The window to pull data from
	 */
	constructor(tetrio) {
		this._tetrio = tetrio
		this._converter = new TetriStateConverter()
		this._state = this._converter._previousRichPresence
	}
	/**
	 * Get the current state
	 * @return state
	 */

	get state() { return this._state }
	/**
	 * Update the state
	 */

	async _updateState() {
		const rawState = await this._tetrio.fetchGameState()
		if (!rawState) return

		this._state = this._converter.convert(rawState)
	}
	/**
	 * Start a loop of updating the state
	 */

	async observe() {
		await this._updateState()
		this._interval = setInterval(() => {
			this._updateState()
		}, OBSERVE_INTERVAL)
	}
	/**
	 * End the loop of updating the state
	 */

	stopObserving() {
		if (typeof this._interval === 'number') {
			clearInterval(this._interval)
			this._interval = undefined
		}
	}

}

module.exports = TetrioStateManager
