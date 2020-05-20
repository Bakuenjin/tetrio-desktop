/**
 * Responsible for holding and validating TETR.IO state data.
 */
class TetrioState {

    /**
     * @param {string} username - The current user
     * @param {string} level - The level of the current user
     * @param {string} menu - The current menu the user is in
     * @param {boolean} inGame - Is the user currently playing?
     * @param {string} rank - The rank of the current user
     */
    constructor(username, level, menu, inGame, rank) {
        this.username = username.toUpperCase()
        this.level = level
        this.menu = menu
        this.inGame = inGame
        this.rank = rank
	}
	
	/**
	 * Checks if this state is equal to the specified state.
	 * @param {TetrioState} state 
	 */
	equalTo(state) {
		return (
			this.username	=== state.username &&
			this.level		=== state.level &&
			this.menu		=== state.menu &&
			this.inGame		=== state.inGame &&
			this.rank		=== state.rank
		)
	}

	/**
	 * Checks if this state has a logged in user.
	 */
	userLoggedIn() {
		return this.username !== ''
	}

}

module.exports = TetrioState