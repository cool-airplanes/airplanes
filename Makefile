PWD=$(shell echo `pwd` | sed 's/\//\\\//g')
PORT=8080

dependencies:
	@echo "Instaling dependencies"
	@sudo apt-get -q=2 install nodejs npm mongodb 
	@sudo npm -q install recess mongojs socket.io
	@echo "Done\n"

install: dependencies

startdb:
	@mkdir -p database/
	@mongod --dbpath database/ --port 28080 --nojournal

start:
	@node www/index.js

dbclient:
	@mongo localhost:28080/avioane

less:
	@recess less/main.less
	@recess --compile less/main.less > page/static/styles.css

.PHONY: dependencies install startdb start dbclient less
