package game

import "errors"

// A game object
type Game struct {
	User User
	Mode string
}

// Mode urls
var modeUrls = map[string]string{
	"training": "/api/training",
	"arena":    "/api/arena",
}

// Create a new game
func NewGame(user User, mode string) (Game, error) {
	// Make sure mode is either training or arena
	if !(mode == "training" || mode == "arena") {
		return Game{}, errors.New("Mode must equal 'training' or 'arena'")
	}

	return Game{
		User: user,
		Mode: mode,
	}, nil
}

// Start the game
func (g *Game) Start() error {
	return nil
}
