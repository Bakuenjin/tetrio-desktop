const MENU_STATES = {
    'Menu (Multiplayer)': ['playmulti', 'league', 'lobby', 'multilisting'],
    'Menu (Singleplayer)': ['play1p', '40l', 'blitz', 'custom'],
    'Menu (Tetra Channel)': ['tetra', 'tetra_records', 'tetra_me', 'tetra_players']
}

const PLAYING_STATES = {
    '40l': '40L',
    'blitz': 'Blitz',
    'custom': 'Custom',
    'play1p': 'Solo',
    'lobby': 'Multiplayer',
    'league': 'Ranked',
    'playmulti': 'Multiplayer'
}

/**
 * @param {{ username: string, level: string, menu: string, rank: string }} prev
 * @param {{ username: string, level: string, menu: string, rank: string }} curr
 */
function identicalStates(prev, curr) {
    return (
        prev.username === curr.username,
        prev.level === curr.level,
        prev.menu === curr.menu,
        prev.rank === curr.rank
    )
}

/**
 * @param {{ username: string, level: string, menu: string, rank: string }} state
 */
function notLoggedIn(state) {
    return state.menu === 'none' && state.username === ''
}

/**
 * @param {{ username: string, level: string, menu: string, rank: string }} prev
 * @param {{ username: string, level: string, menu: string, rank: string }} curr
 */
function startedPlaying(prev, curr) {
    return (
        prev.menu !== 'none' &&
        curr.menu === 'none' &&
        curr.username !== ''
    )
}

/**
 * @param {{ username: string, level: string, menu: string, rank: string }} prev
 * @param {{ username: string, level: string, menu: string, rank: string }} curr
 */
exports.convertTetrioState = (prev, curr) => {
    if (identicalStates(prev, curr)) return

    if (notLoggedIn(curr)) {
        return {
            state: 'Not logged in',
            details: 'Main Menu',
            smallImageKey: 'z',
            smallImageText: 'Rank: None'
        }
    }
    
    if (startedPlaying(prev, curr)) {
        const playingState = PLAYING_STATES[prev.menu]
        return {
            state: curr.username + ` (Level ${curr.level})`,
            details: playingState ? `Playing (${playingState})` : 'Playing',
            smallImageKey: curr.rank.replace('+', 'p'),
            smallImageText: `Rank: ${curr.rank === 'z' ? 'None' : curr.rank.toUpperCase()}`
        }
    }

    const menuState = Object.keys(MENU_STATES).find(key => {
        return MENU_STATES[key].some(state => curr.menu === state)
    })

    return {
        state: curr.username + ` (Level ${curr.level})`,
        details: menuState ? menuState : 'Main Menu',
        smallImageKey: curr.rank.replace('+', 'p'),
        smallImageText: `Rank: ${curr.rank === 'z' ? 'None' : curr.rank.toUpperCase()}`
    }

}