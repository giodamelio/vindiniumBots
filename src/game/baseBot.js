class BaseBot {
    start(viewUrl) {}
    move() {
        throw new Error("You MUST override the move function with your bot logic");
    }
    end(winner) {}
    crashed() {}
}

module.exports = BaseBot;

