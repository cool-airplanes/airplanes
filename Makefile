PWD=$(shell echo `pwd` | sed 's/\//\\\//g')
PORT=8080

dependencies:
	@echo "Instaling dependencies"
	@sudo apt-get -q=2 install nginx nodejs npm mongodb 
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

.PHONY: dependencies install startdb start dbclient
