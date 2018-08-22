const electron = require('electron')

const ipc = electron.ipcRenderer

const $ = selector => document.querySelector(selector)

const { parse } = require('./utils/parser')

ipc.on('file-opened', (event, file, content) => {
	$('.raw-markdown').value = content
	$('.rendered-html').innerHTML = parse(content)
	console.log(parse(content))
})

$('.raw-markdown').addEventListener('keyup', event => {
	const content = event.target.value
	$('.rendered-html').innerHTML = parse(content)
})
