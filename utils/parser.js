const marked = require('marked')

const parser = {
	parse: markdown => {
		return marked(markdown)
	}
}

module.exports = parser
