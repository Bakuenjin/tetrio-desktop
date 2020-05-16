const NOT_LOGGED_IN_PRESENSE = {
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

class TetrioStateConverter {

    constructor() {
        this._previousState = {}
        this._previousRichPresence = NOT_LOGGED_IN_PRESENSE
    }

    _identicalStates(currentState) {
        return (
            this._previousState.username === currentState.username &&
            this._previousState.level    === currentState.level &&
            this._previousState.menu     === currentState.menu &&
            this._previousState.inGame   === currentState.inGame &&
            this._previousState.rank     === currentState.rank
        )
    }

    _notLoggedIn(currentState) {
        return (
            currentState.menu       === 'none' &&
            currentState.username   === ''
        )
    }

    convert(state) {
        if (this._identicalStates(state))
            return this._previousRichPresence
        
        if (this._notLoggedIn(state)) {
            this._previousRichPresence = NOT_LOGGED_IN_PRESENSE
            return NOT_LOGGED_IN_PRESENSE
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