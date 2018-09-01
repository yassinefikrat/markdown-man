const electron = require('electron')

const ipc = electron.ipcRenderer

const $ = selector => document.querySelector(selector)

const { parse } = require('./utils/parser')

let currentFile
let saveIsDisabled = true

// Helper function to be called when a file is able to be saved
const activateSaveButtons = () => {
	$('.save-button').removeAttribute('disabled')
	$('.save-as-button').removeAttribute('disabled')
	saveIsDisabled = false
}

const disableSaveButtons = () => {
	$('.save-button').setAttribute('disabled', true)
	$('.save-as-button').setAttribute('disabled', true)
	saveIsDisabled = true
}

const activateCloseButton = () => {
	$('.close-file-button').removeAttribute('disabled')
}

const disableCloseButton = () => {
	$('.close-file-button').setAttribute('disabled', true)
}

const displayFileName = fileName => {
	$('.yy-filename').innerHTML = fileName
}

const eraseFileName = () => {
	$('.yy-filename').innerHTML = ''
}

ipc.on('file-opened', (event, fileName, content) => {
	$('.raw-markdown').value = content
	$('.rendered-html').innerHTML = parse(content)
	currentFile = fileName
	activateSaveButtons()
	activateCloseButton()
	displayFileName(fileName)
})

ipc.on('file-saved', (event, fileName) => {
	if (!currentFile) currentFile = fileName
	activateCloseButton()
})

// Triggers at every change in the markdown editing panel
$('.raw-markdown').addEventListener('keyup', event => {
	const content = event.target.value
	$('.rendered-html').innerHTML = parse(content)

	if (saveIsDisabled) activateSaveButtons()
})

// Wiring up the buttons
const mainProcess = electron.remote.require('./index')

$('.open-file-button').addEventListener('click', () => {
	mainProcess.openFile()
})

$('.save-button').addEventListener('click', () => {
	if (currentFile) mainProcess.saveFile(currentFile, $('.raw-markdown').value)
	else mainProcess.saveFileAs($('.raw-markdown').value)
})

$('.save-as-button').addEventListener('click', () => {
	mainProcess.saveFileAs($('.raw-markdown').value)
})

$('.close-file-button').addEventListener('click', () => {
	$('.raw-markdown').value = ''
	$('.rendered-html').innerHTML = ''
	currentFile = ''
	disableSaveButtons()
	disableCloseButton()
	eraseFileName()
})
