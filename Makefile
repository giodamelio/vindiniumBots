# Setup our enviroment
export PATH := $(CURDIR)/node_modules/.bin:$(PATH) # Get our binarys from npm
export DIST := $(CURDIR)/dist
export SRC := $(CURDIR)/src

# --- ALL ---
all:
	@$(MAKE) -j api app bots game manager models

all-watch:
	@$(MAKE) -j \
		api-watch \
		app-watch \
		bots-watch \
		game-watch \
		manager-watch \
		models-watch

# --- API ---
api: $(shell find $(SRC)/api/ -type f -name "*.js")
	@$(MAKE) -C src/api/ build

api-watch: $(shell find $(SRC)/api/ -type f -name "*.js")
	@$(MAKE) -C src/api/ watch

# --- App ---
app: $(shell find $(SRC)/app/js/ -type f -name "*.jsx")
	@$(MAKE) -C src/app/ build

app-watch: $(shell find $(SRC)/app/js/ -type f -name "*.jsx")
	@$(MAKE) -C src/app/ watch

# --- Bots ---
bots: $(shell find $(SRC)/bots/ -type f -name "*.js")
	@$(MAKE) -C src/bots/ build

bots-watch: $(shell find $(SRC)/bots/ -type f -name "*.js")
	@$(MAKE) -C src/bots/ watch

# --- Game ---
game: $(shell find $(SRC)/game/ -type f -name "*.js")
	@$(MAKE) -C src/game/ build

game-watch: $(shell find $(SRC)/game/ -type f -name "*.js")
	@$(MAKE) -C src/game/ watch

# --- Manager ---
manager: $(shell find $(SRC)/manager/ -type f -name "*.js")
	@$(MAKE) -C src/manager/ build

manager-watch: $(shell find $(SRC)/manager/ -type f -name "*.js")
	@$(MAKE) -C src/manager/ watch

# --- Models ---
models: $(shell find $(SRC)/models/ -type f -name "*.js")
	@$(MAKE) -C src/models/ build

models-watch: $(shell find $(SRC)/models/ -type f -name "*.js")
	@$(MAKE) -C src/models/ watch

# --- Misc ---
# Clean up
clean:
	@rm -r dist/
	
# Tell make which targets don't take dependencies
.PHONY: clean all all-watch

