package main

import (
	"flag"
	"fmt"

	"github.com/bitly/go-simplejson"
	"github.com/giodamelio/vindiniumBots/config"
	"github.com/giodamelio/vindiniumBots/game"
	"github.com/gosexy/redis"
)

func main() {
	fmt.Println("Starting server...")

	// Load the config file
	configFileLocation := flag.String("config", "config.json", "The location of the config file")

	config, err := config.LoadConfig(*configFileLocation)
	if err != nil {
		panic(err)
	}

	// Connect to redis
	r := redis.New()
	err = r.Connect("localhost", 6379)
	if err != nil {
		panic(err)
	}
	defer r.Close()

	// Set redis values from config
	r.Set("RunningGames", 0)

	// Send our games
	gameChan := make(chan []string)

	// Get the max amount of games to run in parrellel
	maxConcurrentGames, err := config.Get("maxConcurrentGames").Int()
	if err != nil {
		panic(err)
	}

	// Start our goroutines to handle the games
	for i := 0; i < maxConcurrentGames; i++ {
		fmt.Println("Starting goroutine", i+1)
		go func() {
			for newGame := range gameChan {
				runGame(config, newGame[1])
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
func runGame(config *simplejson.Json, newGame string) {
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
	botConfig := config.Get("bots").GetIndex(1)
	serverConfig := config.Get("servers").GetIndex(1)
	userConfig := serverConfig.Get("users").GetIndex(0)

	// Create bot
	name, _ := botConfig.Get("name").String()
	location, _ := botConfig.Get("location").String()
	bot := game.Bot{
		Name:     name,
		Location: location,
	}

	// Create user
	username, _ := userConfig.Get("username").String()
	key, _ := userConfig.Get("key").String()
	user := game.User{
		Username: username,
		Key:      key,
	}

	// Create server
	name, _ = serverConfig.Get("name").String()
	url, _ := serverConfig.Get("url").String()
	server := game.Server{
		Name: name,
		Url:  url,
	}

	// Create a new game
	game, err := game.NewGame(bot, user, server, "training")
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
