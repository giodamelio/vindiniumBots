package game

import "github.com/robertkrimen/otto"

// Config object
type Config struct {
	Servers []Server
	Bots    []Bot
}

// Server object
type Server struct {
	Name  string
	Url   string
	Users []User
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
	vm       *otto.Otto
}
