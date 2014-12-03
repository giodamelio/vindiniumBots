package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"

	"github.com/giodamelio/vindiniumBots/game"
	"github.com/gosexy/redis"
)

func main() {
	fmt.Println("Starting server...")

	// Load the config file
	configFileLocation := flag.String("config", "config.json", "The location of the config file")
	config := loadConfig(configFileLocation)

	// Connect to redis
	r := redis.New()
	err := r.Connect("localhost", 6379)
	if err != nil {
		panic(err)
	}
	defer r.Close()

	// Set redis values from config
	r.Set("RunningGames", 0)

	// Send our games
	gameChan := make(chan []string)

	// Start our goroutines to handle the games
	for i := 0; i < config.MaxConcurrentGames; i++ {
		fmt.Println("Starting goroutine", i+1)
		go func() {
			for newGame := range gameChan {
				runGame(config, newGame)
			}
		}()
	}

	// Loop forever starting games when they appear in the queue
	for {
		// Wait for a new game
		gameInfo, err := r.BRPop(0, "gameQueue")
		if err != nil {
			fmt.Println(err)
		}

		// Start a game
		gameChan <- gameInfo
	}

}

// Run a game
func runGame(config game.Config, newGame []string) {
	// Connect to redis
	r := redis.New()
	err := r.Connect("localhost", 6379)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer r.Close()

	// Increment game counter
	fmt.Println("Starting game")
	_, err = r.Incr("RunningGames")
	if err != nil {
		fmt.Println(err)
	}

	// Get our test info
	server := config.Servers[1]
	user := server.Users[0]

	// Create a new game
	game, err := game.NewGame(config.Bots[1], user, server, "training")
	if err != nil {
		panic(err)
	}
	game.Turns = 20

	// Start the game
	err = game.Start()
	if err != nil {
		panic(err)
	}

	// Decrement game counter
	r.Decr("RunningGames")
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
