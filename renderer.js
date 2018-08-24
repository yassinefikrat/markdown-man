const electron = require('electron')

const ipc = electron.ipcRenderer

const $ = selector => document.querySelector(selector)

const { parse } = require('./utils/parser')

let currentFile

ipc.on('file-opened', (event, fileName, content) => {
	$('.raw-markdown').value = content
	$('.rendered-html').innerHTML = parse(content)
	currentFile = fileName
	activateSaveButtons()
})

// Triggers at every change in the markdown editing panel
$('.raw-markdown').addEventListener('keyup', event => {
	const content = event.target.value
	$('.rendered-html').innerHTML = parse(content)
})


// Wiring up the buttons
const mainProcess = electron.remote.require('./index')

$('.open-file-button').addEventListener('click', () => {
  	mainProcess.openFile()
})

$('.save-button').addEventListener('click', () => {
  	mainProcess.saveFile(currentFile, $('.raw-markdown').value)
})

$('.save-as-button').addEventListener('click', () => {
	console.log("currentFile : " + currentFile)
  	mainProcess.saveFileAs($('.raw-markdown').value)
})

const activateSaveButtons = () => {
	$('.save-button').removeAttribute("disabled")
	$('.save-as-button').removeAttribute("disabled")
}