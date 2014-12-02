package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"

	"github.com/giodamelio/vindiniumBots/game"
)

func main() {
	// Load the config file
	configFileLocation := flag.String("config", "config.json", "The location of the config file")
	config := loadConfig(configFileLocation)

	// Get our test info
	server := config.Servers[1]
	user := server.Users[0]

	// Create a new game
	game := game.Game{
		User:   user,
		Server: server,
		Mode:   "training",
		Turns:  20,
	}

	// Start the game
	err := game.Start()
	if err != nil {
		panic(err)
	}
}

// Load the config file
func loadConfig(filename *string) game.Config {
	// Read the file
	configFile, err := ioutil.ReadFile(*filename)
	if err != nil {
		panic(err)
	}

	// Decode it
	var config game.Config
	err = json.Unmarshal(configFile, &config)
	if err != nil {
		panic(err)
	}

	return config
}
