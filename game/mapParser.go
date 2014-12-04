package game

import "github.com/bitly/go-simplejson"

// A map object
type Map struct {
	Size  int
	Tiles [][]int
}

// The tile types
var tileType = map[string]int{
	"EMPTY":        0,
	"WOOD":         1,
	"TAVERN":       2,
	"HERO_1":       3,
	"HERO_2":       4,
	"HERO_3":       5,
	"HERO_4":       6,
	"MINE_NEUTRAL": 7,
	"MINE_1":       8,
	"MINE_2":       9,
	"MINE_3":       10,
	"MINE_4":       11,
}

// How to draw the tiles
var tileDraw = []string{"  ", "##", "[]", "@1", "@2", "@3", "@4", "$-", "$1", "$2", "$3", "$4"}

// Parse a map
func parseMap(board *simplejson.Json) Map {
	// Create our map
	size, _ := board.Get("size").Int()
	outMap := Map{
		Size: size,
	}

	// The new board
	var tiles [][]int

	// Convert to map type
	rawTiles, _ := board.Get("tiles").String()
	for y := 0; y < len(rawTiles); y = y + size*2 {
		line := rawTiles[y : y+size*2]
		var row []int
		for x := 0; x < len(line); x = x + 2 {
			rawTile := line[x : x+2]

			// Determin what type of tile it is
			var tile int
			switch rune(rawTile[0]) {
			case '#':
				tile = tileType["WOOD"]
			case '[':
				tile = tileType["TAVERN"]
			case '@':
				switch rune(rawTile[1]) {
				case '1':
					tile = tileType["HERO_1"]
				case '2':
					tile = tileType["HERO_2"]
				case '3':
					tile = tileType["HERO_3"]
				case '4':
					tile = tileType["HERO_4"]
				}
			case '$':
				switch rune(rawTile[1]) {
				case '-':
					tile = tileType["MINE_NEUTRAL"]
				case '1':
					tile = tileType["MINE_1"]
				case '2':
					tile = tileType["MINE_2"]
				case '3':
					tile = tileType["MINE_3"]
				case '4':
					tile = tileType["MINE_4"]
				}
			}
			row = append(row, tile)
		}
		tiles = append(tiles, row)
	}

	outMap.Tiles = tiles

	return outMap
}
