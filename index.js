const { app } = require('electron')

const TetrioWindow = require('./models/TetrioWindow')
const TetrioRichPresence = require('./models/TetrioRichPresence')

const CLIENT_ID = '708375600531767336'

/**
 * @type {TetrioWindow}
 */
let tetrioGame

/**
 * @type {TetrioRichPresence}
 */
let tetrioRichPresence

const openTetrio = () => {
    tetrioGame = new TetrioWindow()
    tetrioRichPresence = new TetrioRichPresence(CLIENT_ID, tetrioGame)

    tetrioGame.on('tetrio-started', () => {
        tetrioRichPresence.start()
    })

    tetrioGame.on('tetrio-closed', () => {
        tetrioGame = undefined
        tetrioRichPresence = undefined
    })
}

app.on('activate', async () => {
    if (!tetrioGame) await openTetrio()
})

app.on('ready', async () => {
    await openTetrio()
})
