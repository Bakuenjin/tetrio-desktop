const { app } = require('electron')

const TetrioWindow = require('./models/TetrioWindow')
const TetrioRichPresence = require('./models/TetrioRichPresence')

const CLIENT_ID = '708375600531767336'

/**
 * @type {TetrioWindow}
 */
let tetrioWindow

/**
 * @type {TetrioRichPresence}
 */
let tetrioRichPresence

const openTetrio = () => {
    tetrioWindow = new TetrioWindow()
    tetrioRichPresence = new TetrioRichPresence(CLIENT_ID, tetrioWindow)

    tetrioWindow.on('tetrio-started', () => {
        tetrioRichPresence.start()
    })

    tetrioWindow.on('tetrio-closed', () => {
        tetrioWindow = undefined
        tetrioRichPresence = undefined
    })
}

app.on('activate', async () => {
    if (!tetrioWindow) await openTetrio()
})

app.on('ready', async () => {
    await openTetrio()
})
