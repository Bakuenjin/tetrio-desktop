const { app } = require('electron')

const TetrioWindow = require('./models/TetrioWindow')
const TetrioStateManager = require('./models/TetrioStateManager')
const TetrioRichPresence = require('./models/TetrioRichPresence')

const CLIENT_ID = '708375600531767336'

/**
 * @type {TetrioWindow}
 */
let tetrioWindow

/**
 * @type {TetrioStateManager}
 */
let tetrioStateManager

/**
 * @type {TetrioRichPresence}
 */
let tetrioRichPresence

const openTetrio = () => {
    tetrioWindow = new TetrioWindow()
    tetrioStateManager = new TetrioStateManager(tetrioWindow)
    tetrioRichPresence = new TetrioRichPresence(CLIENT_ID, tetrioStateManager)

    tetrioWindow.on('tetrio-started', () => {
        tetrioRichPresence.start()
    })

    tetrioWindow.on('tetrio-closed', () => {
        tetrioRichPresence.disconnect()
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
