package game

import "github.com/aarzilli/golua/lua"

// Server object
type Server struct {
	Name string
	Url  string
}

// User object
type User struct {
	Username string
	Key      string
}

// Bot object
type Bot struct {
	Name     string
	Location string
	vm       *lua.State
}
