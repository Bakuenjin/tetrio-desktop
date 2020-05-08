const { contextBridge, ipcRenderer } = require('electron')

const validSendChannels = ['update-rich-presence']
const validReceiveChannels = ['gather-discord-info']

contextBridge.exposeInMainWorld('ipc', {
    send: (channel, ...data) => {
        if (validChannels.includes(channel))
            ipcRenderer.send(channel, ...data)
    },
    receive: (channel, fn) => {
        if (validChannels.includes(channel))
            ipcRenderer.on(channel, (event, ...args) => fn(...args))
    }
})