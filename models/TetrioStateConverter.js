const TetrioState = require('./TetrioState')

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
	 * Convert the TETR.IO state into a rich presence object.
	 * @param {TetrioState} state - The state to convert
	 * @returns {{ state: string, details: string, smallImageKey: string, smallImageText: string, largeImageText?: string}}
	 */
	convert(state) {
		if (state.equalTo(this._previousState))
			return this._previousRichPresence
		
		if (!state.userLoggedIn()) {
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
