package game

import "encoding/json"

// Represent the state of the game at any given point in time
type State struct {
	Game    GameData
	Hero    Hero
	Token   string
	ViewUrl string
	PlayUrl string
}

// Info about the game
type GameData struct {
	Id       string
	Turn     int
	MaxTurns int
	Heros    []Hero
	Board    Board
	Finished bool
}

// Info about a hero
type Hero struct {
	Id        int
	Name      string
	Pos       Position
	Life      int
	Gold      int
	MineCount int
	SpawnPos  Position
	Crashed   bool
}

// A point on the map
type Position struct {
	X int
	Y int
}

// Info about the board
type Board struct {
	Size     int
	Tiles    string
	finished bool
}

// Parse the game state from a server response
func ParseState(rawState []byte) (State, error) {
	var state State
	err := json.Unmarshal(rawState, &state)
	if err != nil {
		return State{}, err
	}
	return state, nil
}
