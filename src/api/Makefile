# Build the api
6TO5_ARGS = \
	--blacklist regenerator \
	--out-dir $(DIST)/api/

build: $(shell find . -type f -name "*.js")
	@6to5 $(6TO5_ARGS) $^

watch: $(shell find . -type f -name "*.js")
	@6to5 --watch $(6TO5_ARGS) $^

server:
	@nodemon --exec iojs --watch $(DIST)/api/ $(DIST)/api/index.js

