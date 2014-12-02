package game

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/robertkrimen/otto"
)

// A game object
type Game struct {
	Bot          Bot
	User         User
	Server       Server
	Mode         string
	Turns        int
	currentState State
}

// A move object
type Move struct {
	Key       string `json:"key"`
	Direction string `json:"dir"`
}

// Mode urls
var modeUrls = map[string]string{
	"training": "/api/training",
	"arena":    "/api/arena",
}

// Create a new game
func NewGame(bot Bot, user User, server Server, mode string) (Game, error) {
	// Make sure mode is either training or arena
	if !(mode == "training" || mode == "arena") {
		return Game{}, errors.New("Mode must equal 'training' or 'arena'")
	}

	// Add the bot to the vm
	bot.vm = otto.New()

	// Load the bot from the file
	botFile, err := ioutil.ReadFile(bot.Location)
	if err != nil {
		return Game{}, err
	}

	// Load the bot into the vm
	bot.vm.Run(botFile)

	// Make sure the bot has a 'bot()' function
	botFunction, err := bot.vm.Get("bot")
	if err != nil {
		return Game{}, err
	}
	if botFunction.IsUndefined() {
		return Game{}, errors.New("Bot must have a 'bot()' function")
	}

	return Game{
		Bot:    bot,
		User:   user,
		Server: server,
		Mode:   mode,
		Turns:  300,
	}, nil
}

// Start the game
func (g *Game) Start() error {
	// Start the game on the server
	type NewGame struct {
		Key   string `json:"key"`
		Turns int    `json:"turns"`
		Map   string `json:"map,omitempty"`
	}

	// Convert data into json string
	reqData, err := json.Marshal(NewGame{
		Key:   g.User.Key,
		Turns: g.Turns,
	})
	if err != nil {
		return err
	}

	// Send request to the server
	response, err := http.Post(g.Server.Url+modeUrls[g.Mode], "application/json", bytes.NewReader(reqData))
	if err != nil {
		return err
	}

	// Parse the response
	rawResponse, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}
	g.currentState, err = ParseState(rawResponse)
	if err != nil {
		return err
	}

	// Print view url
	fmt.Println("Watch the game at", g.currentState.ViewUrl)

	// Loop until the game is done or we run into an error
	for {
		// Check to see if the game is done
		if g.currentState.Game.Finished {
			fmt.Println("Game complete")
			break
		}

		// Get the move from the bot
		rawMove, err := g.Bot.vm.Run("bot()")
		if err != nil {
			return err
		}
		move, err := rawMove.ToString()
		if err != nil {
			return err
		}

		// Send move
		g.currentState, err = g.sendMove(move)
		if err != nil {
			return err
		}
		fmt.Println("Turn", g.currentState.Game.Turn, "Sent move:", move)
	}

	return nil
}

// Send a move to the server
func (g *Game) sendMove(direction string) (State, error) {
	// Convert data into json string
	reqData, err := json.Marshal(Move{
		Direction: direction,
		Key:       g.User.Key,
	})
	if err != nil {
		return State{}, err
	}

	// Send request to the server
	response, err := http.Post(g.currentState.PlayUrl, "application/json", bytes.NewReader(reqData))
	if err != nil {
		return State{}, err
	}

	// Parse the response and set it as the current state
	rawResponse, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return State{}, err
	}
	state, err := ParseState(rawResponse)
	if err != nil {
		return State{}, err
	}

	return state, nil
}
