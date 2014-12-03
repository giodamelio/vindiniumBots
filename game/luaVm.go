package game

import (
	"errors"

	"github.com/stevedonovan/luar"
)

// Create our lua vm and add functions and constants to it
func (g *Game) createLuaVM() error {
	// Add the bot to the vm
	g.Bot.vm = luar.Init()

	// Load the bot from the file
	g.Bot.vm.DoFile(g.Bot.Location)

	// Expose the tile constants
	luar.Register(g.Bot.vm, "", luar.Map{
		"tileType": tileType,
		"tileDraw": tileDraw,
	})

	// Make sure there is a bot function
	botFunction := luar.NewLuaObjectFromName(g.Bot.vm, "bot")
	if botFunction.Type != "function" {
		return errors.New("Bot(" + g.Bot.Location + ") must have a 'bot()' function")
	}

	return nil
}
