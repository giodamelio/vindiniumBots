package game

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/bitly/go-simplejson"
	"github.com/stevedonovan/luar"
)

// A game object
type Game struct {
	Bot          Bot
	User         User
	Server       Server
	Mode         string
	Turns        int
	currentState *simplejson.Json
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
func NewGame(bot Bot, server Server, user User, mode string, turns int) (Game, error) {
	// Make sure mode is either training or arena
	if !(mode == "training" || mode == "arena") {
		return Game{}, errors.New("Mode must equal 'training' or 'arena'")
	}

	// Create our game
	game := Game{
		Bot:    bot,
		User:   user,
		Server: server,
		Mode:   mode,
		Turns:  turns,
	}

	// Set up our lua vm
	err := game.createLuaVM()
	if err != nil {
		return Game{}, err
	}

	return game, nil
}

// Start the game
func (g *Game) Start() error {
	// Clean up the lua vm when the game is done
	defer g.Bot.vm.Close()

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
	g.currentState, err = simplejson.NewJson(rawResponse)
	if err != nil {
		return err
	}

	// Loop until the game is done or we run into an error
	for {
		// Check to see if the game is done
		isFinished, _ := g.currentState.GetPath("game", "finished").Bool()
		if isFinished {
			break
		}

		// Parse the map
		board := g.currentState.GetPath("game", "board")
		parsedMap := parseMap(board)

		// Get the move from the bot
		botFunction := luar.NewLuaObjectFromName(g.Bot.vm, "bot")
		luaTiles := luar.NewLuaObjectFromValue(g.Bot.vm, parsedMap.Tiles)
		luaSize := luar.NewLuaObjectFromValue(g.Bot.vm, parsedMap.Size)
		rawMove, err := botFunction.Call(luaTiles, luaSize)
		if err != nil {
			return err
		}
		move := rawMove.(string)

		// Send move
		g.currentState, err = g.sendMove(move)
		if err != nil {
			return err
		}
	}

	return nil
}

// Send a move to the server
func (g *Game) sendMove(direction string) (*simplejson.Json, error) {
	// Convert data into json string
	reqData, err := json.Marshal(Move{
		Direction: direction,
		Key:       g.User.Key,
	})
	if err != nil {
		return &simplejson.Json{}, err
	}

	// Send request to the server
	playUrl, _ := g.currentState.Get("playUrl").String()
	response, err := http.Post(playUrl, "application/json", bytes.NewReader(reqData))
	if err != nil {
		return &simplejson.Json{}, err
	}

	// Parse the response and set it as the current state
	rawResponse, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return &simplejson.Json{}, err
	}
	state, err := simplejson.NewJson(rawResponse)
	if err != nil {
		return &simplejson.Json{}, err
	}

	return state, nil
}
