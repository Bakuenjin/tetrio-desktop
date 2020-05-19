const NOT_LOGGED_IN_PRESENCE = {
	state: 'Not logged in',
	details: 'MAIN MENU',
	smallImageKey: 'z',
	smallImageText: 'Rank: None',

}

const DETAIL_TYPES = {
	'40l': '40 LINES',
	'blitz': 'BLITZ',
	'custom': 'CUSTOM',
	'play1p': 'SINGLEPLAYER',
	'lobby': 'MULTIPLAYER',
	'multilisting': 'MULTIPLAYER',
	'league': 'TETRA LEAGUE',
	'playmulti': 'MULTIPLAYER',
	'tetra': 'TETRA CHANNEL',
	'tetra_records': 'TETRA CHANNEL',
	'tetra_me': 'TETRA CHANNEL',
	'tetra_players': 'TETRA CHANNEL',
}

/**
 * Responsible for converting TETR.IO states
 * into rich presence objects.
 */
class TetrioStateConverter {

	constructor() {
		this._previousState = {}
		this._previousRichPresence = NOT_LOGGED_IN_PRESENCE
	}
	
	/**
	 * Checks if the current state is identical with the previously converted state.
	 * @param {any} currentState - The current state
	 */
	_identicalStates(currentState) {
		return (
			this._previousState.username === currentState.username &&
			this._previousState.level    === currentState.level &&
			this._previousState.menu     === currentState.menu &&
			this._previousState.inGame   === currentState.inGame &&
			this._previousState.rank     === currentState.rank
		)
	}

	/**
	 * Checks if the current state has a logged in user.
	 * @param {any} currentState - The current state
	 */
	_notLoggedIn(currentState) {
		return (
			currentState.menu       === 'none' &&
			currentState.username   === ''
		)
	}

	/**
	 * Convert the TETR.IO state into a rich presence object.
	 * @param {any} state - The state to convert
	 * @returns {any}
	 */
	convert(state) {
		if (this._identicalStates(state))
			return this._previousRichPresence
		
		if (this._notLoggedIn(state)) {
			this._previousRichPresence = NOT_LOGGED_IN_PRESENCE
			return NOT_LOGGED_IN_PRESENCE
		}
		
		const currentRichPresence = {
			state: state.inGame ? 'Playing' : 'Idle',
			details: DETAIL_TYPES[state.menu] ? DETAIL_TYPES[state.menu] : this._previousRichPresence.details,
			smallImageKey: state.rank.replace('+', 'p'),
			smallImageText: `Rank: ${state.rank === 'z' ? 'None' : state.rank.toUpperCase()}`,
			largeImageText: `${state.username} - Level: ${state.level}`
		}

		this._previousState = state
		this._previousRichPresence = currentRichPresence
		return currentRichPresence
	}

}

module.exports = TetrioStateConverter
