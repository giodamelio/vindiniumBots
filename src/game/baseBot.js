class BaseBot {
    move() {
        throw new Error("You MUST override the move function with your bot logic");
    }
}

module.exports = BaseBot;

