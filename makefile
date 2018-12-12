LINT = $(PWD)/node_modules/.bin/eslint
JEST = $(PWD)/node_modules/.bin/jest
BABEL = $(PWD)/node_modules/.bin/babel
JSDOC = $(PWD)/node_modules/.bin/jsdoc

DIR ?= src

install:
	yarn install
	yarn global add jsinspect
	yarn add lru-cache ioredis memory-cache --peer

build:
	$(BABEL) src -d . --copy-files

watch:
	$(BABEL) -w src -d . --copy-files

lint:
	$(LINT) --format 'node_modules/eslint-friendly-formatter' --fix src/*.js

test: lint
	$(JEST) --env=node --coverage --runInBand --forceExit $(DIR)

dev:
	$(JEST) -o --watch --runInBand --forceExit $(DIR)

publish: build
	npm publish

push-doc:
	$(JSDOC) src README.md
	git checkout gh-pages
	\cp -rf out/* .
	git diff origin/gh-pages
	@read -p "push? [y/n]" yn; \
		case $$yn in \
			[Yy]* ) git add .; git commit -m '$(shell date +%FT%T%Z) update'; git push;; \
			[Nn]* ) exit;; \
			* ) echo "Please answer yes or no.";; \
		esac

.PHONY: test lint dev build watch publish install push-doc
