const TetrioWindow = require('./TetrioWindow')
const TetriStateConverter = require('./TetrioStateConverter')

const OBSERVE_INTERVAL = 1000

/**
 * Responsible for gathering the TETR.IO state
 * and converting it into the rich presence state object.
 */
class TetrioStateManager {

	/**
	 * @param {tetrioWindow} tetrio - The TETR.IO window from which the state is fetched
	 */
	constructor(tetrio) {
		this._tetrio = tetrio
		this._converter = new TetriStateConverter()
		this._state = this._converter._previousRichPresence
	}

	/**
	 * The current TETR.IO rich presence state object.
	 * @type {any}
	 */
	get state() { return this._state }

	/**
	 * Fetches the current TETR.IO state and converts it into the rich presence state object.
	 */
	async _updateState() {
		const rawState = await this._tetrio.fetchGameState()
		if (!rawState) return

		this._state = this._converter.convert(rawState)
	}

	/**
	 * Start the interval responsible for updating and converting the TETR.IO state.
	 */
	async observe() {
		await this._updateState()
		this._interval = setInterval(() => {
			this._updateState()
		}, OBSERVE_INTERVAL)
	}

	/**
	 * Stops the interval responsible for updating and converting the TETR.IO state.
	 */
	stopObserving() {
		if (typeof this._interval === 'number') {
			clearInterval(this._interval)
			this._interval = undefined
		}
	}

}

module.exports = TetrioStateManager
