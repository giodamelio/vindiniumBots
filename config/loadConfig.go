package config

import (
	"io/ioutil"

	"github.com/bitly/go-simplejson"
)

// Load config from a file
func LoadConfig(path string) (*simplejson.Json, error) {
	// Read the file
	configFile, err := ioutil.ReadFile(path)
	if err != nil {
		return &simplejson.Json{}, err
	}

	// Parse it with simplejson
	config, err := simplejson.NewJson(configFile)
	if err != nil {
		return &simplejson.Json{}, err
	}

	return config, nil
}
