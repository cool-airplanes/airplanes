PWD=$(shell echo `pwd` | sed 's/\//\\\//g')
PORT=9200

dependencies:
	@echo "Instaling dependencies"
	@sudo apt-get -q=2 install nginx nodejs npm mongodb 
	@sudo npm -q install recess connect uglify-js jshint mongojs -g
	@echo "Done\n"
	
nginx:
	@sed 's/PWD/${PWD}/g' < nginx.conf.sample | sed 's/PORT/${PORT}/g' > nginx.conf
	@sudo rm -f /etc/nginx/sites-available/airplanes /etc/nginx/sites-enabled/airplanes
	@sudo ln -s nginx.conf /etc/nginx/sites-available/airplanes
	@sudo ln -s /etc/nginx/sites-available/airplanes /etc/nginx/sites-enabled/airplanes
	@sudo service nginx restart

bootstrap:
	@echo "Installing Bootstrap"
	@git submodule init
	@git submodule update
	@make -C bootstrap bootstrap -s
	@echo "Bootstrap Installed"

install: dependencies nginx bootstrap

startdb:
	@mkdir -p db/
	@mongod --dbpath db/ --port 28080

start:
	@node www/index.js

.PHONY: dependencies nginx bootstrap install startdb start
