'use strict'
const electron = require('electron')

const { app } = electron

// My imports
const { dialog } = electron
const fs = require('fs')

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// Prevent window being garbage collected
let mainWindow

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		show: false,
		backgroundColor: '#2e2c29',
		width: 600,
		height: 400
	})

	win.once('ready-to-show', () => {
		win.show()
	})

	win.maximize()

	win.loadURL(`file://${__dirname}/index.html`)
	win.on('closed', onClosed)

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
})

app.on('ready', () => {
	mainWindow = createMainWindow()

	mainWindow.webContents.on('did-finish-load', () => {
		openFile()
	})
})

// My functions

function openFile() {
	const files = dialog.showOpenDialog(mainWindow, {
		properties: ['openFile'],
		filters: [
			{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
		]
	})

	if (!files) {
		return
	}

	const file = files[0]

	const content = fs.readFileSync(file).toString()

	mainWindow.webContents.send('file-opened', file, content)
}
