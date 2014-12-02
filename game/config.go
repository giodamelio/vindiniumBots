package game

// Config object
type Config struct {
	Servers []Server
}

// Server object
type Server struct {
	Name  string
	Url   string
	Users []User
}

type User struct {
	Username string
	Key      string
}
