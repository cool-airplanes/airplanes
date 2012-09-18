var fs = require('fs');

function loadPage(fileName) {
	return fs.readFileSync(__dirname + '/../page/' + fileName, 'utf8');
}

module.exports.loadPage = loadPage;
