// A simple bot that moves in a random direction
DIRECTIONS = ["North", "East", "South", "West"];
function bot() {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}
