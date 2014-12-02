package game

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

// A game object
type Game struct {
	User   User
	Server Server
	Mode   string
	Turns  int
}

// Mode urls
var modeUrls = map[string]string{
	"training": "/api/training",
	"arena":    "/api/arena",
}

// Create a new game
func NewGame(user User, server Server, mode string) (Game, error) {
	// Make sure mode is either training or arena
	if !(mode == "training" || mode == "arena") {
		return Game{}, errors.New("Mode must equal 'training' or 'arena'")
	}

	return Game{
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
	rawResponse, _ := ioutil.ReadAll(response.Body)

	fmt.Println(string(rawResponse))
	return nil
}
