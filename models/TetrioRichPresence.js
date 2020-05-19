const richPresence = require('discord-rich-presence')
const TetrioStateManager = require('./TetrioStateManager')

const UPDATE_INTERVAL = 5 * 1000

/**
 * Responsible for sending the current TETR.IO state
 * as a rich presence to the Discord client via the local RPC server.
 */
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
	 * Starts the interval responsible for updating the rich presence.
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
	 * Stops the interval responsible for updating the rich presence.
	 */
	stop() {
		this._tetrio.stopObserving()
		if (typeof this._interval === 'number') {
			clearInterval(this._interval)
			this._interval = undefined
		}
	}

	/**
	 * Connects to the Discord clients local RPC server.
	 */
	connect() {
		this._rp = richPresence(this._id)
	}

	/**
	 * Disconnects from the Discord clients local RPC server.
	 */
	disconnect() {
		this._rp.disconnect()
		this._rp = undefined
	}

	/**
	 * Updates the rich presence by sending the current TETR.IO state
	 * to the Discord client via the RPC connection.
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
