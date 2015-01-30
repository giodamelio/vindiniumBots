# Our browserify config
BROWSERIFY_ARGS = \
	--transform reactify \
	--transform 6to5ify \
	--entry js/main.jsx \
	--outfile $(DIST)/app/bundle.js

# Compile our webapp with browserify, reactify and 6to5ify
build: $(shell find js/ -type f -name "*.jsx")
	@mkdir -p $(DIST)/app/
	@browserify $(BROWSERIFY_ARGS)

# Watch and autorecompile
watch: $(shell find $(SRC)/app/js/ -type f -name "*.jsx")
	@mkdir -p $(DIST)/app/
	@watchify -v $(BROWSERIFY_ARGS)

