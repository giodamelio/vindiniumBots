# Build the game
6TO5_ARGS = \
	--blacklist regenerator \
	--out-dir $(DIST)/game/

build: $(shell find . -type f -name "*.js")
	@6to5 $(6TO5_ARGS) $^

watch: $(shell find . -type f -name "*.js")
	@6to5 --watch $(6TO5_ARGS) $^

