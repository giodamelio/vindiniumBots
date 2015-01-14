class BaseBot {
    constructor(log) {
        this.log = log;
    }
    start(viewUrl) {}
    move() {
        throw new Error("You MUST override the move function with your bot logic");
    }
    end(winner) {}
    crashed() {}
}

module.exports = BaseBot;

